import React, { useState, useRef } from 'react';

const Home = ({ navigate, user }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [posts, setPosts] = useState([]); // قائمة المنشورات الصوتية
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  // دالة بدء التسجيل
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        setAudioURL(URL.createObjectURL(audioBlob));
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      alert("يرجى السماح بالوصول للمايكروفون");
    }
  };

  // دالة إيقاف التسجيل
  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  // دالة نشر الصوت في الصفحة
  const handlePublish = () => {
    if (audioURL) {
      const newPost = {
        id: Date.now(),
        user: user.name,
        audio: audioURL,
        time: 'الآن'
      };
      setPosts([newPost, ...posts]);
      setAudioURL(null); // تصفير المسجل بعد النشر
    }
  };

  return (
    <div className="main-app">
      <header className="header">
        <i className="fas fa-search"></i>
        <h3>صوتي</h3>
        <i className="fas fa-user-circle" onClick={() => navigate('profile')}></i>
      </header>

      <div className="feed-content">
        {/* واجهة التسجيل */}
        <div className="voice-card">
          <h4>{isRecording ? 'جاري الاستماع...' : 'سجل فكرتك بصوتك'}</h4>
          <div 
            className={`mic-btn ${isRecording ? 'recording' : ''}`} 
            onClick={isRecording ? stopRecording : startRecording}
          >
            <i className="fas fa-microphone"></i>
          </div>
          
          {audioURL && (
            <div className="audio-player-box">
              <audio src={audioURL} controls />
              <div className="action-btns">
                 <button className="btn-o" onClick={() => setAudioURL(null)}>حذف</button>
                 <button className="btn-p" onClick={handlePublish}>نشر الآن</button>
              </div>
            </div>
          )}
        </div>

        {/* قائمة المنشورات الصوتية */}
        <div className="posts-list">
          {posts.length === 0 ? (
            <div className="post-card-dummy" style={{textAlign: 'center', opacity: 0.6}}>
               لا توجد منشورات صوتية بعد. كن أول من يسجل!
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <img src="https://via.placeholder.com/40" className="post-avatar" alt="user" />
                  <div className="post-user-info">
                    <strong>{post.user}</strong>
                    <span>{post.time}</span>
                  </div>
                </div>
                <audio src={post.audio} controls className="post-audio" />
                <div className="post-actions">
                  <i className="far fa-heart"></i>
                  <i className="far fa-comment"></i>
                  <i className="fas fa-share"></i>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <nav className="bottom-nav">
        <i className="fas fa-home active"></i>
        <i className="fas fa-film"></i>
        <i className="fas fa-microphone" style={{color: '#6c63ff'}}></i>
        <i className="fas fa-bell"></i>
      </nav>
    </div>
  );
};

export default Home;
