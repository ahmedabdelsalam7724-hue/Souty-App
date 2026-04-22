import { put } from '@vercel/blob';
import { createClient } from '@vercel/kv';

export default async function handler(request, response) {
  // 1. استخراج اسم المستخدم من الـ Cookie (التأكد من الهوية)
  const cookieHeader = request.headers.cookie || '';
  const username = cookieHeader
    .split(';')
    .find(c => c.trim().startsWith('auth_user='))
    ?.split('=')[1];

  // منع الرفع لو المستخدم مش مسجل دخول
  if (!username) {
    return response.status(401).json({ 
      error: 'عفواً، يجب تسجيل الدخول أولاً لربط الصوت بحسابك الشخصي.' 
    });
  }

  // التأكد إن فيه "داتا" مبعوتة (الملف الصوتي)
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'يجب استخدام POST لإرسال الملفات' });
  }

  try {
    // 2. الاتصال بـ Vercel KV (قاعدة بيانات Redis)
    const kv = createClient({
      url: process.env.STORAGE_REST_API_URL,
      token: process.env.STORAGE_REST_API_TOKEN,
    });

    // 3. رفع الملف الصوتي لـ Vercel Blob
    // بنسمي الملف باسم اليوزر وتوقيت الرفع عشان ميتكررش
    const blob = await put(`recordings/${username}-${Date.now()}.wav`, request.body, {
      access: 'public',
      contentType: 'audio/wav'
    });

    // 4. تجهيز بيانات المنشور (Post Object)
    const newPost = {
      id: `p_${Date.now()}`,
      audioUrl: blob.url,
      author: username, // الربط المباشر بملف المستخدم
      createdAt: new Date().toLocaleString('ar-EG'),
      likes: 0
    };

    // 5. حفظ المنشور في قاعدة البيانات في مكانين:
    // أ- القائمة العامة لكل الناس (Feed)
    await kv.lpush('all_posts', newPost);
    
    // ب- قائمة منشورات هذا المستخدم فقط (بتاعة البروفايل)
    await kv.lpush(`user_posts:${username}`, newPost);

    // الرد بالنجاح
    return response.status(200).json({ 
      success: true, 
      message: 'تم النشر وربط الملف بحسابك الشخصي بنجاح 🎙️',
      post: newPost 
    });

  } catch (error) {
    console.error('Upload Error:', error);
    return response.status(500).json({ 
      error: 'حدث خطأ أثناء محاولة الرفع أو الحفظ في قاعدة البيانات' 
    });
  }
}
