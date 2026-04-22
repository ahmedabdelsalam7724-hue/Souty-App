import { createClient } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, email, password } = req.body;

  const kv = createClient({
    url: process.env.STORAGE_REST_API_URL,
    token: process.env.STORAGE_REST_API_TOKEN,
  });

  try {
    // 1. التأكد إن اليوزر مش موجود قبل كدة في قاعدة البيانات
    const userExists = await kv.exists(`user:${username}`);
    if (userExists) {
      return res.status(400).json({ error: 'الاسم ده محجوز فعلاً!' });
    }

    // 2. تخزين بيانات المستخدم كاملة في Redis
    const userData = {
      username,
      email,
      password, // في الشغل الحقيقي يفضل تشفيرها، بس كدة تمام للبداية
      joinedAt: new Date().toISOString()
    };
    
    await kv.set(`user:${username}`, userData);

    // 3. تثبيت الهوية (Set Cookie) عشان السيرفر يعرفه في المرات الجاية
    // الـ Cookie دي بتخلي السيرفر "فاكر" إن اللي بيكلمه هو اليوزر ده
    res.setHeader('Set-Cookie', `auth_user=${username}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800`);

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'فشل الاتصال بقاعدة البيانات' });
  }
}
