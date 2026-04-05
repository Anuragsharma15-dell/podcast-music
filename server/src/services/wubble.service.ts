import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const WUBBLE_BASE_URL = process.env.WUBBLE_BASE_URL || 'https://api.wubble.ai';
const WUBBLE_API_KEY = process.env.WUBBLE_API_KEY || '';

const wubbleClient = axios.create({
  baseURL: WUBBLE_BASE_URL,
  headers: {
    Authorization: `Bearer ${WUBBLE_API_KEY}`,
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

/**
 * POST /api/v1/chat
 */
export const sendWubbleChat = async (
  prompt: string,
  projectId?: string,
  vocals: boolean = false
): Promise<{ project_id?: string; request_id: string; status?: string }> => {
  const body: any = { prompt, vocals: false }; // always false
  if (projectId) body.project_id = projectId;

  const { data } = await wubbleClient.post('/api/v1/chat', body);
  console.log('✅ Wubble chat response:', JSON.stringify(data, null, 2));
  return data;
};

/**
 * Poll directly with request_id
 * GET /api/v1/polling/:requestId
 * Returns status + audio URL once completed
 */
export const pollWubbleRequest = async (requestId: string): Promise<{
  status: string;
  streaming?: {
    final_audio_url?: string;
    stream_url?: string;
    completed_at?: string;
  };
  results?: {
    custom_data?: {
      audios?: Array<{
        duration_seconds?: number;
        audio_url?: string;
      }>;
    };
  };
  age_minutes?: number;
  error?: string;
}> => {
  const { data } = await wubbleClient.get(`/api/v1/polling/${requestId}`);
  console.log('✅ Wubble poll response:', JSON.stringify(data, null, 2));
  return data;
};

/**
 * Extract audio URL from Wubble polling response
 * Correct field is: data.streaming.final_audio_url
 */
export const extractAudioUrl = (data: any): string | undefined => {
  return (
    data?.streaming?.final_audio_url ||
    data?.results?.streaming?.final_audio_url ||
    data?.results?.custom_data?.audios?.[0]?.audio_url ||
    data?.audio_url ||
    data?.output_url ||
    data?.url ||
    data?.file_url ||
    undefined
  );
};

/**
 * Extract duration in seconds from Wubble polling response
 */
export const extractDuration = (data: any): number | undefined => {
  return (
    data?.results?.custom_data?.audios?.[0]?.duration_seconds ||
    data?.duration ||
    undefined
  );
};

/**
 * Health check — GET /health
 */
export const checkWubbleHealth = async (): Promise<boolean> => {
  try {
    const { data } = await wubbleClient.get('/health');
    console.log('✅ Wubble health:', JSON.stringify(data));
    return true;
  } catch (err) {
    console.error('❌ Wubble health check failed:', err);
    return false;
  }
};