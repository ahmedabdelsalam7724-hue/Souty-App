import { createClient } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, email, password, bio } = req.body;

  // الاتصال بقاعدة البيانات (Redis)
  const kv = createClient({
    url: process.env.STORAGE_REST_API_URL,
    token: process.env.STORAGE_REST_API_TOKEN,
  });

  try {
    // 1. التأكد إن البريد أو اليوزر نيم مش موجودين قبل كدة
    const existingUser = await kv.get(`user:${username}`);
    if (existingUser) {
      return res.status(400).json({ error: 'اسم المستخدم هذا موجود بالفعل!' });
    }

    // 2. إنشاء كائن المستخدم (User Profile Object)
    const newUser = {
      id: `u_${Date.now()}`,
      username,
      email,
      password, // ملاحظة: في المشاريع الحقيقية لازم تعمل تشفير (Hash) لكلمة السر
      bio,
      createdAt: new Date().toISOString(),
      followers: 0,
      likesReceived: 0
    };

    // 3. تخزين الملف في قاعدة البيانات
    // بنخزنه تحت مفتاح "user:اسم_المستخدم" عشان نعرف نوصله بسرعة
    await kv.set(`user:${username}`, newUser);

    return res.status(200).json({ success: true, user: newUser });
  } catch (error) {
    return res.status(500).json({ error: 'حدث خطأ في السيرفر' });
  }
}
