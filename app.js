// حركنا تعريف السوكت لتحت عشان ميوقفش تحميل الصفحة
let socket;

// التحكم في الشاشات (Splash Screen)
setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    if (splash) splash.style.display = 'none';
    
    if (!localStorage.getItem('userName')) {
        document.getElementById('auth-screen').classList.remove('hidden');
    } else {
        loadPosts(); // لو مسجل دخول حمل البوستات علطول
    }
}, 2500);

// تهيئة السوكت بحذر
try {
    socket = io();
    socket.on('newPost', (post) => {
        addPostToUI(post, true);
    });
} catch (e) {
    console.log("Socket.io not ready yet");
}

function login() {
    const name = document.getElementById('nameIn').value;
    if (name) {
        localStorage.setItem('userName', name);
        document.getElementById('auth-screen').classList.add('hidden');
        loadPosts();
    } else {
        alert("من فضلك ادخل الاسم");
    }
}

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    const target = document.getElementById(tabName + '-tab');
    if (target) target.classList.remove('hidden');
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
    } catch (err) { 
        alert("الميكروفون مطلوب! تأكد من إعطاء الصلاحية للمتصفح."); 
    }
}

function stopRec() {
    if (mediaRecorder) {
        mediaRecorder.stop();
        document.getElementById('recordingOverlay').style.display = 'none';
    }
}

async function uploadAudio(blob) {
    const formData = new FormData();
    formData.append('audio', blob);
    formData.append('userName', localStorage.getItem('userName'));
    try {
        await fetch('/api/upload', { method: 'POST', body: formData });
    } catch (err) {
        console.error("خطأ في الرفع:", err);
    }
}

async function loadPosts() {
    try {
        const res = await fetch('/api/posts');
        if (!res.ok) return;
        const posts = await res.json();
        const list = document.getElementById('postList');
        if (list) {
            list.innerHTML = '';
            posts.forEach(post => addPostToUI(post));
        }
    } catch (err) {
        console.log("قاعدة البيانات لسه بتصحى.. استنى ثواني");
    }
}

function addPostToUI(post, isNew = false) {
    const list = document.getElementById('postList');
    if (!list) return;
    const html = `
        <div class="audio-card">
            <b style="color:#6C63FF;">${post.userName}</b>
            <audio controls src="${post.audioUrl}" style="width:100%; margin-top:10px;"></audio>
        </div>`;
    if (isNew) list.insertAdjacentHTML('afterbegin', html);
    else list.innerHTML += html;
}
