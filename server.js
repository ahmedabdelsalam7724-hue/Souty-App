const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer'); // لرفع الملفات الصوتية

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // لتشغيل واجهة المستخدم

// إعداد تخزين الريكوردات الصوتية
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, 'audio-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// قاعدة بيانات وهمية مؤقتاً (بينما نربط MongoDB)
let posts = [
    { id: 1, user: "أحمد", country: "مصر", content: "أول بوست صوتي", audioUrl: "", type: "work" },
    { id: 2, user: "سارة", country: "السعودية", content: "CV محترف هنا", audioUrl: "", type: "cv" }
];

// جلب المنشورات مع الفلترة (زر التقسيم)
app.get('/api/posts', (req, res) => {
    const { country, type } = req.query;
    let filtered = posts;
    if (country) filtered = filtered.filter(p => p.country === country);
    if (type) filtered = filtered.filter(p => p.type === type);
    res.json(filtered);
});

// رفع منشور صوتي جديد
app.post('/api/posts', upload.single('audio'), (req, res) => {
    const newPost = {
        id: posts.length + 1,
        user: req.body.user,
        country: req.body.country,
        content: req.body.content,
        audioUrl: req.file ? `/uploads/${req.file.filename}` : "",
        type: req.body.type || "general"
    };
    posts.push(newPost);
    res.json({ message: "تم النشر بنجاح!", post: newPost });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`السيرفر شغال على http://localhost:${PORT}`));
