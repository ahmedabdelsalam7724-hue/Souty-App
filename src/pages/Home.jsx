import React, { useState, useRef } from 'react';

const Home = ({ navigate, user }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null); 
  const [posts, setPosts] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

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
    } catch (err) { alert("تأكد من إعطاء إذن المايكروفون للمتصفح"); }
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
      // الرفع إلى Vercel Storage عبر الـ API اللي عملناه
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: audioBlob,
      });

      if (!response.ok) throw new Error('فشل الرفع');

      const blobData = await response.json();

      const newPost = {
        id: Date.now(),
        user: user.name,
        audio: blobData.url, // الرابط العالمي من Vercel
        time: 'الآن'
      };

      setPosts([newPost, ...posts]);
      setAudioURL(null);
      setAudioBlob(null);
      alert("تم النشر على Vercel بنجاح! 🚀");
    } catch (error) {
      console.error(error);
      alert("خطأ في الرفع: تأكد من تفعيل Storage في Vercel Dashboard");
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
          <h4>{isRecording ? 'جاري التسجيل...' : 'سجل وانشر للجميع'}</h4>
          <div className={`mic-btn ${isRecording ? 'recording' : ''}`} onClick={isRecording ? stopRecording : startRecording}>
            <i className="fas fa-microphone"></i>
          </div>
          
          {audioURL && (
            <div className="audio-player-box">
              <audio src={audioURL} controls />
              <div className="action-btns">
                 <button className="btn-o" onClick={() => {setAudioURL(null); setAudioBlob(null);}}>حذف</button>
                 <button className="btn-p" onClick={handlePublish} disabled={isUploading}>
                    {isUploading ? 'جاري الرفع...' : 'نشر عالمي'}
                 </button>
              </div>
            </div>
          )}
        </div>

        <div className="posts-list">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <img src="https://via.placeholder.com/40" className="post-avatar" alt="user" />
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
