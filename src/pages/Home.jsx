import React, { useState, useRef } from 'react';

const Home = ({ navigate, user }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
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
      alert("يرجى السماح بالوصول للمايكروفون للتسجيل");
    }
  };

  // دالة إيقاف التسجيل
  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
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
        {/* كارت تسجيل الصوت الاحترافي */}
        <div className="voice-card">
          <h4>{isRecording ? 'جاري الاستماع...' : 'سجل فكرتك الآن'}</h4>
          <div 
            className={`mic-btn ${isRecording ? 'recording' : ''}`} 
            onClick={isRecording ? stopRecording : startRecording}
          >
            <i className="fas fa-microphone"></i>
          </div>
          
          {audioURL && (
            <div className="audio-player">
              <audio src={audioURL} controls />
              <button className="btn-p" style={{marginTop: '15px'}} onClick={() => alert('قريباً: سيتم الرفع لقاعدة البيانات')}>
                نشر التسجيل
              </button>
            </div>
          )}
        </div>

        <div className="post-card-dummy">
          <p>أهلاً بك يا {user.name.split(' ')[0]} في "صوتي". جرب تسجيل أول مقطع صوتي لك!</p>
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
