// api/upload.js
import { put } from '@vercel/blob';

export default async function handler(request, response) {
  // السطر ده هو اللي بيخلي Vercel يقرأ التوكين السري تلقائياً
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return response.status(500).json({ error: "التوكين مش موجود في إعدادات Vercel" });
  }

  try {
    const blob = await put(`audio-${Date.now()}.wav`, request.body, {
      access: 'public', // خليه public عشان الناس تقدر تسمع المنشورات
      contentType: 'audio/wav'
    });

    return response.status(200).json(blob);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
