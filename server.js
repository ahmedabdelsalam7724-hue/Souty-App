require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// أهم تعديل عشان ملفات الـ HTML والـ CSS تظهر
app.use(express.static(path.join(__dirname, '/')));

const uploadDir = '/tmp/uploads'; 
if (!fs.existsSync(uploadDir)) { fs.mkdirSync(uploadDir); }

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to Database"))
    .catch(err => console.log("❌ DB Error:", err));

const Post = mongoose.model('Post', new mongoose.Schema({
    userName: String,
    audioUrl: String,
    createdAt: { type: Date, default: Date.now }
}));

const upload = multer({ storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => cb(null, Date.now() + '.webm')
})});

// توجيه أي طلب للرئيسية يفتح ملف index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) { res.status(500).json(err); }
});

app.post('/api/upload', upload.single('audio'), async (req, res) => {
    try {
        const newPost = new Post({
            userName: req.body.userName || "Unknown",
            audioUrl: `/uploads/${req.file.filename}`
        });
        await newPost.save();
        io.emit('newPost', newPost);
        res.json(newPost);
    } catch (err) { res.status(500).send(err); }
});

module.exports = app;
