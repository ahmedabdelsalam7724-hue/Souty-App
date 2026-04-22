import React, { useState, useRef, useEffect } from 'react';

const Home = ({ navigate, user }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null); 
  const [posts, setPosts] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  // محاكاة لجلب المنشورات (ممكن نطورها لاحقاً بقاعدة بيانات للينكات)
  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('souty_posts') || '[]');
    setPosts(savedPosts);
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
      };
      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) { alert("افتح المايك من إعدادات المتصفح"); }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const handlePublish = async () => {
    if (!audioBlob) return;
    setIsUploading(true);

    try {
      // الرفع لـ Vercel Blob
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: audioBlob,
      });

      if (!response.ok) throw new Error('فشل الرفع');

      const blobData = await response.json();

      const newPost = {
        id: Date.now(),
        user: user.name,
        audio: blobData.url, // ده الرابط العالمي اللي Vercel ادهولك
        time: 'الآن'
      };

      const updatedPosts = [newPost, ...posts];
      setPosts(updatedPosts);
      localStorage.setItem('souty_posts', JSON.stringify(updatedPosts));
      
      setAudioURL(null);
      setAudioBlob(null);
      alert("مبروك! صوتك دلوقتي "أونلاين" على سيرفرات Vercel 🚀");
    } catch (error) {
      console.error(error);
      alert("خطأ: تأكد من عمل Redeploy للمشروع بعد تفعيل Storage");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="main-app">
      <header className="header">
        <i className="fas fa-search"></i>
        <h3>صوتي - Vercel Cloud</h3>
        <i className="fas fa-user-circle" onClick={() => navigate('profile')}></i>
      </header>

      <div className="feed-content">
        <div className="voice-card">
          <h4>{isRecording ? 'جاري تسجيل صوتك...' : 'شارك فكرتك مع العالم'}</h4>
          <div className={`mic-btn ${isRecording ? 'recording' : ''}`} onClick={isRecording ? stopRecording : startRecording}>
            <i className="fas fa-microphone"></i>
          </div>
          
          {audioURL && (
            <div className="audio-player-box">
              <audio src={audioURL} controls />
              <div className="action-btns">
                 <button className="btn-o" onClick={() => {setAudioURL(null); setAudioBlob(null);}}>حذف</button>
                 <button className="btn-p" onClick={handlePublish} disabled={isUploading}>
                    {isUploading ? 'جاري الرفع للسحابة...' : 'نشر عالمي 🌍'}
                 </button>
              </div>
            </div>
          )}
        </div>

        <div className="posts-list">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <img src={`https://ui-avatars.com/api/?name=${post.user}&background=random`} className="post-avatar" alt="user" />
                <div className="post-user-info">
                  <strong>{post.user}</strong>
                  <span>{post.time}</span>
                </div>
              </div>
              <audio src={post.audio} controls className="post-audio" />
            </div>
          ))}
        </div>
      </div>

      <nav className="bottom-nav">
        <i className="fas fa-home active"></i>
        <i className="fas fa-microphone" style={{color: '#6c63ff'}}></i>
      </nav>
    </div>
  );
};

export default Home;
