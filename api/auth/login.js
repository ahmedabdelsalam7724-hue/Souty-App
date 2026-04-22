import { createClient } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, password } = req.body;

  const kv = createClient({
    url: process.env.STORAGE_REST_API_URL,
    token: process.env.STORAGE_REST_API_TOKEN,
  });

  try {
    // 1. البحث عن المستخدم في قاعدة البيانات
    const userData = await kv.get(`user:${username}`);

    // 2. التأكد من وجود المستخدم ومطابقة كلمة السر
    if (!userData || userData.password !== password) {
      return res.status(401).json({ error: 'اسم المستخدم أو كلمة السر غلط! ❌' });
    }

    // 3. لو كله تمام، نزرع الـ Cookie عشان السيرفر يفتكره في كل الـ Requests الجاية
    res.setHeader('Set-Cookie', `auth_user=${username}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800`);

    return res.status(200).json({ success: true, message: 'تم الدخول بنجاح' });
  } catch (err) {
    return res.status(500).json({ error: 'فشل الاتصال بقاعدة البيانات' });
  }
}
