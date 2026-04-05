import { Request, Response } from 'express';
import Music from '../models/podcast.model';
import { scrapeArticle, extractTitle } from '../services/scraper.service';
import { detectTone, buildMusicPrompt } from '../services/tone.service';
import {
  sendWubbleChat,
  pollWubbleRequest,
  extractAudioUrl,
  extractDuration,
  checkWubbleHealth as checkWubbleHealthService,
} from '../services/wubble.service';

// POST /api/podcast/generate
export const generatePodcast = async (req: Request, res: Response) => {
  try {
    const { input, voice = 'deep_narrator', tone: forcedTone } = req.body;

    if (!input) {
      return res.status(400).json({ error: 'Input text or URL is required' });
    }

    // 1. Extract content
    let text = input;
    let inputUrl: string | undefined;
    if (input.startsWith('http://') || input.startsWith('https://')) {
      inputUrl = input;
      text = await scrapeArticle(input);
    }

    // 2. Detect tone
    const tone = forcedTone || detectTone(text);

    // 3. Extract title
    const title = extractTitle(text);

    // 4. Build prompt
    const prompt = buildMusicPrompt(text, tone, voice);

    // 5. Save to DB
    const music = new Music({
      title,
      inputText: text.slice(0, 5000),
      inputUrl,
      tone,
      voice,
      status: 'generating',
    });
    await music.save();

    // 6. Call Wubble
    const wubbleRes = await sendWubbleChat(prompt, undefined, false);
    console.log('✅ Wubble initial response:', wubbleRes);

    music.wubbleProjectId = wubbleRes.project_id;
    music.wubbleRequestId = wubbleRes.request_id;
    await music.save();

    return res.status(202).json({
      id: music._id,
      status: 'generating',
      requestId: wubbleRes.request_id,
      projectId: wubbleRes.project_id,
      title,
      tone,
    });
  } catch (err: any) {
    console.error('generatePodcast error:', err);
    return res.status(500).json({
      error: err.message || 'Generation failed',
      details:
        err?.response?.data ||
        err?.cause?.message ||
        err?.code ||
        'No details',
    });
  }
};

// GET /api/music/status/:id
export const getMusicStatus = async (req: Request, res: Response) => {
  try {
    const music = await Music.findById(req.params.id);
    if (!music) return res.status(404).json({ error: 'Music not found' });

    if (music.status === 'generating' && music.wubbleRequestId) {
      try {
        // Auto-fail if stuck for more than 5 minutes
        const ageMs = Date.now() - new Date(music.createdAt).getTime();
        if (ageMs > 5 * 60 * 1000) {
          console.warn('⚠️ Stuck for 5+ mins — marking failed');
          music.status = 'failed';
          await music.save();
        } else {
          // Single-stage poll directly with request_id
          const pollResult = await pollWubbleRequest(music.wubbleRequestId);
          console.log('📦 Poll result status:', pollResult.status);

          if (pollResult.status === 'completed') {
            music.status = 'completed';
            music.audioUrl = extractAudioUrl(pollResult);
            music.duration = extractDuration(pollResult);
            await music.save();
            console.log('✅ Audio URL saved:', music.audioUrl);
            console.log('✅ Duration saved:', music.duration);
          } else if (pollResult.status === 'failed') {
            music.status = 'failed';
            await music.save();
            console.log('❌ Wubble generation failed');
          } else {
            console.log('⏳ Still processing, age:', pollResult.age_minutes, 'mins');
          }
        }
      } catch (e: any) {
        console.error('Polling error:', e.message);
      }
    }

    return res.json({
      id: music._id,
      title: music.title,
      status: music.status,
      audioUrl: music.audioUrl ?? null,
      duration: music.duration ?? null,
      tone: music.tone,
      voice: music.voice,
      wubbleRequestId: music.wubbleRequestId,
      createdAt: music.createdAt,
    });

  } catch (err: any) {
    console.error('getMusicStatus error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};

// GET /api/music/all
export const getAllMusic = async (req: Request, res: Response) => {
  try {
    const music = await Music.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .select('title status audioUrl tone voice duration createdAt');
    return res.json(music);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// DELETE /api/music/:id
export const deleteMusic = async (req: Request, res: Response) => {
  try {
    await Music.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// GET /api/podcast/health
export const checkWubbleHealth = async (req: Request, res: Response) => {
  try {
    const healthy = await checkWubbleHealthService();
    if (!healthy) {
      return res.status(503).json({ healthy: false, error: 'Wubble service unreachable' });
    }
    return res.json({ healthy: true });
  } catch (err: any) {
    console.error('checkWubbleHealth error:', err);
    return res.status(500).json({ healthy: false, error: err?.message || 'Health check failed' });
  }
};