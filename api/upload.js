import { put } from '@vercel/blob';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // اسم الملف هيكون عبارة عن الوقت الحالي عشان ميتكررش
    const fileName = `audio-${Date.now()}.wav`;
    
    const blob = await put(fileName, request.body, {
      access: 'public',
      contentType: 'audio/wav'
    });

    return response.status(200).json(blob);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
