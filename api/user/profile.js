import { createClient } from '@vercel/kv';

export default async function handler(req, res) {
  // 1. نعرف مين اليوزر من الـ Cookie
  const cookieHeader = req.headers.cookie || '';
  const username = cookieHeader.split(';').find(c => c.trim().startsWith('auth_user='))?.split('=')[1];

  if (!username) return res.status(401).json({ error: 'سجل دخول الأول' });

  const kv = createClient({
    url: process.env.STORAGE_REST_API_URL,
    token: process.env.STORAGE_REST_API_TOKEN,
  });

  try {
    // 2. نجيب بيانات اليوزر + منشوراته من الـ Redis
    const userData = await kv.get(`user:${username}`);
    const userPosts = await kv.lrange(`user_posts:${username}`, 0, -1) || [];

    return res.status(200).json({
      user: userData,
      posts: userPosts
    });
  } catch (error) {
    return res.status(500).json({ error: 'فشل في جلب البيانات' });
  }
}
