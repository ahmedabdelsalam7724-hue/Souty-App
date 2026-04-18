const socket = io(); 

socket.on('newPost', (post) => {
    addPostToUI(post, true);
});

let mediaRecorder;
let audioChunks = [];

// التحكم في الشاشات
setTimeout(() => {
    document.getElementById('splash-screen').style.display = 'none';
    if (!localStorage.getItem('userName')) {
        document.getElementById('auth-screen').classList.remove('hidden');
    }
}, 2500);

function login() {
    const name = document.getElementById('nameIn').value;
    if (name) {
        localStorage.setItem('userName', name);
        document.getElementById('auth-screen').classList.remove('hidden'); // تأكد من إخفاء الشاشة
        document.getElementById('auth-screen').classList.add('hidden');
        loadPosts();
    }
}

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    document.getElementById(tabName + '-tab').classList.remove('hidden');
}

async function startRec() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            uploadAudio(audioBlob);
        };
        mediaRecorder.start();
        document.getElementById('recordingOverlay').style.display = 'flex';
    } catch (err) { alert("الميكروفون مطلوب!"); }
}

function stopRec() {
    mediaRecorder.stop();
    document.getElementById('recordingOverlay').style.display = 'none';
}

async function uploadAudio(blob) {
    const formData = new FormData();
    formData.append('audio', blob);
    formData.append('userName', localStorage.getItem('userName'));
    // استخدام مسار مباشر بدون localhost
    await fetch('/api/upload', { method: 'POST', body: formData });
}

async function loadPosts() {
    const res = await fetch('/api/posts');
    const posts = await res.json();
    const list = document.getElementById('postList');
    list.innerHTML = '';
    posts.forEach(post => addPostToUI(post));
}

function addPostToUI(post, isNew = false) {
    const list = document.getElementById('postList');
    const html = `
        <div class="audio-card" style="background:#1A1A1A; padding:15px; border-radius:15px; margin-bottom:10px;">
            <b style="color:#6C63FF;">${post.userName}</b>
            <audio controls src="${post.audioUrl}" style="width:100%; margin-top:10px;"></audio>
        </div>`;
    if (isNew) list.insertAdjacentHTML('afterbegin', html);
    else list.innerHTML += html;
}

window.onload = loadPosts;
