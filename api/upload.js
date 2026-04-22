import { put } from '@vercel/blob';
import { createClient } from '@vercel/kv';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. رفع الصوت للمخزن
    const blob = await put(`audio-${Date.now()}.wav`, request.body, {
      access: 'public',
      contentType: 'audio/wav'
    });

    // 2. ربط النوتة (استخدام المتغيرات اللي Vercel عملها)
    const kv = createClient({
      url: process.env.STORAGE_REST_API_URL, // تأكد إن أولها STORAGE لو كنت سبتها
      token: process.env.STORAGE_REST_API_TOKEN,
    });

    const newPost = {
      id: Date.now(),
      user: "مستخدم صوتي",
      audio: blob.url,
      time: new Date().toLocaleString('ar-EG')
    };

    // 3. حفظ في النوتة
    const existingPosts = await kv.get('all_posts') || [];
    await kv.set('all_posts', [newPost, ...existingPosts]);

    return response.status(200).json(newPost);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
