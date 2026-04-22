// api/upload.js
import { put } from '@vercel/blob';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // رفع الملف لـ Vercel Blob
    const blob = await put('voice-post.wav', request.body, {
      access: 'public',
      contentType: 'audio/wav'
    });

    return response.status(200).json(blob);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
