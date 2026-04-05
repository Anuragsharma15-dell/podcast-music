const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// POST /api/podcast/generate
export const generatePodcast = async ({ input, voice, tone }) => {
  const res = await fetch(`${BASE_URL}/podcast/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input, voice, tone }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Generation failed');
  return data; // { id, status, requestId, title, tone }
};

// GET /api/music/status/:id
export const getMusicStatus = async (id) => {
  const res = await fetch(`${BASE_URL}/podcast/status/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to get status');
  return data; // { id, title, status, audioUrl, duration, tone, voice, createdAt }
};

// GET /api/music/all
export const getAllMusic = async () => {
  const res = await fetch(`${BASE_URL}/podcast/all`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load library');
  return data;
};

// DELETE /api/music/:id
export const deleteMusic = async (id) => {
  const res = await fetch(`${BASE_URL}/podcast/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete');
  return data;
};

// Poll status until completed or failed
// onProgress(status, attempt) called on each poll
export const pollUntilDone = async (id, onProgress, intervalMs = 5000, maxAttempts = 60) => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise((res) => setTimeout(res, intervalMs));
    const data = await getMusicStatus(id);
    if (onProgress) onProgress(data.status, attempt);
    if (data.status === 'completed') return data;
    if (data.status === 'failed') throw new Error('Generation failed on server');
  }
  throw new Error('Timed out waiting for generation');
};