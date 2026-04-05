export type Tone = 'tech' | 'health' | 'business' | 'calm' | 'upbeat' | 'dramatic' | 'neutral';

const toneKeywords: Record<Tone, string[]> = {
  tech: ['AI', 'technology', 'software', 'startup', 'data', 'code', 'developer', 'blockchain', 'cloud', 'digital'],
  health: ['health', 'wellness', 'fitness', 'mental', 'medical', 'disease', 'medicine', 'therapy', 'exercise'],
  business: ['business', 'market', 'finance', 'stock', 'economy', 'investment', 'revenue', 'profit', 'startup'],
  calm: ['nature', 'meditation', 'peace', 'mindfulness', 'relax', 'travel', 'culture', 'art', 'history'],
  upbeat: ['success', 'achievement', 'celebration', 'launch', 'win', 'record', 'amazing', 'incredible'],
  dramatic: ['crisis', 'war', 'politics', 'disaster', 'climate', 'breaking', 'urgent', 'emergency'],
  neutral: [],
};

export const detectTone = (text: string): Tone => {
  const lower = text.toLowerCase();
  const scores: Record<Tone, number> = {
    tech: 0, health: 0, business: 0, calm: 0, upbeat: 0, dramatic: 0, neutral: 0,
  };

  for (const [tone, keywords] of Object.entries(toneKeywords)) {
    for (const kw of keywords) {
      const regex = new RegExp(`\\b${kw.toLowerCase()}\\b`, 'gi');
      const matches = lower.match(regex);
      if (matches) scores[tone as Tone] += matches.length;
    }
  }

  const best = (Object.entries(scores) as [Tone, number][])
    .filter(([t]) => t !== 'neutral')
    .sort((a, b) => b[1] - a[1])[0];

  return best && best[1] > 0 ? best[0] : 'neutral';
};

export const buildMusicPrompt = (text: string, tone: Tone, voice: string): string => {
  const toneInstructions: Record<Tone, string> = {
    tech: 'modern intelligent electronic ambient music with subtle tech sounds, no vocals',
    health: 'soothing uplifting instrumental music with soft calming melodies, no vocals',
    business: 'confident motivating corporate background music, no vocals',
    calm: 'serene ambient peaceful contemplative music, no vocals',
    upbeat: 'energetic dynamic music with exciting rhythms, no vocals',
    dramatic: 'cinematic background music with intense engaging melodies, no vocals',
    neutral: 'balanced professional instrumental background music, no vocals',
  };
return `Create a ${toneInstructions[tone]} that captures the mood of the following content:\n\n${text}\n\nThe music should be suitable for a podcast intro or background. Focus on evoking the right emotions for the given tone.`;
}
  