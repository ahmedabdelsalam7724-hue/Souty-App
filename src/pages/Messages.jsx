import React, { useState, useRef, useEffect } from 'react';

const mockChats = [
  { id: 1, name: 'سارة محمد', avatar: 'https://ui-avatars.com/api/?name=سارة+محمد&background=FF6584&color=fff&bold=true', lastMsg: 'رسالة صوتية 🎙️', time: 'الآن', unread: 2, online: true },
  { id: 2, name: 'محمد أحمد', avatar: 'https://ui-avatars.com/api/?name=محمد+أحمد&background=6C63FF&color=fff&bold=true', lastMsg: 'رسالة صوتية 🎙️', time: 'منذ 5د', unread: 0, online: true },
  { id: 3, name: 'نور الهدى', avatar: 'https://ui-avatars.com/api/?name=نور+الهدى&background=43B89C&color=fff&bold=true', lastMsg: 'رسالة صوتية 🎙️', time: 'أمس', unread: 1, online: false },
  { id: 4, name: 'عمر خالد', avatar: 'https://ui-avatars.com/api/?name=عمر+خالد&background=f59e0b&color=fff&bold=true', lastMsg: 'رسالة صوتية 🎙️', time: 'أمس', unread: 0, online: false },
];

const mockMessages = [
  { id: 1, from: 'other', duration: '0:15', time: '10:30 ص', waveform: [40,60,80,50,90,30,70,55,85,45,65,75,35,80,60] },
  { id: 2, from: 'me', duration: '0:28', time: '10:32 ص', waveform: [60,40,70,90,30,80,50,75,45,85,55,65,35,90,60] },
  { id: 3, from: 'other', duration: '0:42', time: '10:35 ص', waveform: [45,75,55,85,35,65,90,40,70,50,80,60,45,75,55] },
  { id: 4, from: 'me', duration: '0:10', time: '10:38 ص', waveform: [80,50,70,40,90,60,30,75,55,85,45,65,90,40,70] },
];

export default function Messages({ navigate, user }) {
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState(mockMessages);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingId, setPlayingId] = useState(null);

  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const timerRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChat]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      mediaRecorder.current.ondataavailable = e => audioChunks.current.push(e.data);
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        sendVoiceMessage(url, recordingTime);
      };
      mediaRecorder.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
    } catch {
      alert('افتح المايك من إعدادات المتصفح');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const sendVoiceMessage = (url, duration) => {
    const newMsg = {
      id: Date.now(),
      from: 'me',
      duration: formatTime(duration),
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      waveform: Array.from({ length: 15 }, () => Math.floor(Math.random() * 70) + 20),
      audioUrl: url,
    };
    setMessages(prev => [...prev, newMsg]);
  };

  // Chat List
  if (!activeChat) {
    return (
      <div style={s.screen}>
        <header style={s.header}>
          <button style={s.backBtn} onClick={() => navigate('home')}>
            <svg width="20" height="20" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <span style={s.headerTitle}>المحادثات 💬</span>
          <button style={s.iconBtn}>
            <svg width="18" height="18" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </header>

        <div style={s.chatList}>
          {mockChats.map(chat => (
            <div key={chat.id} style={s.chatItem} onClick={() => setActiveChat(chat)}>
              <div style={s.avatarWrapper}>
                <img src={chat.avatar} style={s.chatAvatar} alt={chat.name} />
                {chat.online && <div style={s.onlineDot} />}
              </div>
              <div style={s.chatInfo}>
                <div style={s.chatTop}>
                  <span style={s.chatName}>{chat.name}</span>
                  <span style={s.chatTime}>{chat.time}</span>
                </div>
                <div style={s.chatBottom}>
                  <span style={s.chatLastMsg}>{chat.lastMsg}</span>
                  {chat.unread > 0 && <span style={s.unreadBadge}>{chat.unread}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Chat Room
  return (
    <div style={s.screen}>
      <header style={s.header}>
        <button style={s.backBtn} onClick={() => setActiveChat(null)}>
          <svg width="20" height="20" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div style={s.chatHeaderInfo}>
          <div style={s.avatarWrapper}>
            <img src={activeChat.avatar} style={s.headerAvatar} alt={activeChat.name} />
            {activeChat.online && <div style={s.onlineDotSmall} />}
          </div>
          <div>
            <div style={s.chatHeaderName}>{activeChat.name}</div>
            <div style={s.chatHeaderStatus}>{activeChat.online ? '🟢 متصل الآن' : 'غير متصل'}</div>
          </div>
        </div>
        <button style={s.iconBtn}>
          <svg width="18" height="18" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
          </svg>
        </button>
      </header>

      {/* Messages */}
      <div style={s.messagesArea}>
        {messages.map(msg => (
          <VoiceMessage
            key={msg.id}
            msg={msg}
            isMe={msg.from === 'me'}
            isPlaying={playingId === msg.id}
            onPlay={() => setPlayingId(playingId === msg.id ? null : msg.id)}
            chat={activeChat}
            user={user}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Recording Bar */}
      <div style={s.inputBar}>
        {isRecording ? (
          <div style={s.recordingBar}>
            <div style={s.recordDot} />
            <span style={s.recordingText}>{formatTime(recordingTime)}</span>
            <div style={s.recordWave}>
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{
                  ...s.recordWaveBar,
                  height: `${Math.random() * 60 + 20}%`,
                  animationDelay: `${i * 0.1}s`
                }} />
              ))}
            </div>
            <button style={s.stopBtn} onClick={stopRecording}>
              <svg width="14" height="14" fill="white" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2"/>
              </svg>
            </button>
          </div>
        ) : (
          <div style={s.normalBar}>
            <span style={s.holdText}>اضغط مطولاً للتسجيل</span>
            <button
              style={s.micBtn}
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
            >
              <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const VoiceMessage = ({ msg, isMe, isPlaying, onPlay, chat, user }) => {
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => setProgress(p => p >= 100 ? 0 : p + 2), 100);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isPlaying]);

  return (
    <div style={{ ...s.msgWrapper, ...(isMe ? s.msgWrapperMe : {}) }}>
      {!isMe && <img src={chat.avatar} style={s.msgAvatar} alt="" />}
      <div style={{ ...s.msgBubble, ...(isMe ? s.msgBubbleMe : {}) }}>
        <div style={s.msgPlayer}>
          <button style={{ ...s.playBtn, ...(isMe ? s.playBtnMe : {}) }} onClick={onPlay}>
            {isPlaying
              ? <svg width="12" height="12" fill="white" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
              : <svg width="12" height="12" fill="white" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>
            }
          </button>
          <div style={s.msgWaveform}>
            {msg.waveform.map((h, i) => (
              <div key={i} style={{
                ...s.msgWaveBar,
                height: `${h}%`,
                background: (i / msg.waveform.length) * 100 < progress
                  ? (isMe ? 'rgba(255,255,255,0.9)' : '#6C63FF')
                  : (isMe ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)'),
              }} />
            ))}
          </div>
          <span style={{ ...s.msgDuration, ...(isMe ? { color: 'rgba(255,255,255,0.7)' } : {}) }}>
            {msg.duration}
          </span>
        </div>
        {msg.audioUrl && <audio ref={audioRef} src={msg.audioUrl} />}
        <div style={{ ...s.msgTime, ...(isMe ? { color: 'rgba(255,255,255,0.5)' } : {}) }}>
          {msg.time} {isMe && '✓✓'}
        </div>
      </div>
    </div>
  );
};

const s = {
  screen: { maxWidth: 480, margin: '0 auto', minHeight: '100vh', background: '#0a0a0a', color: '#f0f0f0', fontFamily: "'Cairo','Segoe UI',sans-serif", direction: 'rtl', display: 'flex', flexDirection: 'column' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: '#111', borderBottom: '1px solid #1e1e1e', position: 'sticky', top: 0, zIndex: 100 },
  headerTitle: { fontSize: 16, fontWeight: 700 },
  backBtn: { background: '#1a1a1a', border: 'none', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  iconBtn: { background: '#1a1a1a', border: 'none', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  chatList: { flex: 1, overflowY: 'auto' },
  chatItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: '1px solid #141414', cursor: 'pointer', transition: 'background 0.15s' },
  avatarWrapper: { position: 'relative', flexShrink: 0 },
  chatAvatar: { width: 50, height: 50, borderRadius: '50%' },
  headerAvatar: { width: 38, height: 38, borderRadius: '50%' },
  onlineDot: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, background: '#22c55e', borderRadius: '50%', border: '2px solid #0a0a0a' },
  onlineDotSmall: { position: 'absolute', bottom: 1, right: 1, width: 9, height: 9, background: '#22c55e', borderRadius: '50%', border: '2px solid #111' },
  chatInfo: { flex: 1 },
  chatTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  chatName: { fontSize: 15, fontWeight: 700 },
  chatTime: { fontSize: 11, color: '#555' },
  chatBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  chatLastMsg: { fontSize: 13, color: '#666' },
  unreadBadge: { background: '#6C63FF', color: 'white', fontSize: 11, fontWeight: 700, width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  chatHeaderInfo: { display: 'flex', alignItems: 'center', gap: 10 },
  chatHeaderName: { fontSize: 15, fontWeight: 700 },
  chatHeaderStatus: { fontSize: 11, color: '#666' },
  messagesArea: { flex: 1, overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 80 },
  msgWrapper: { display: 'flex', alignItems: 'flex-end', gap: 8 },
  msgWrapperMe: { flexDirection: 'row-reverse' },
  msgAvatar: { width: 30, height: 30, borderRadius: '50%', flexShrink: 0 },
  msgBubble: { background: '#1a1a1a', border: '1px solid #252525', borderRadius: '16px 16px 16px 4px', padding: '10px 12px', maxWidth: '75%' },
  msgBubbleMe: { background: 'linear-gradient(135deg,#6C63FF,#a855f7)', border: 'none', borderRadius: '16px 16px 4px 16px' },
  msgPlayer: { display: 'flex', alignItems: 'center', gap: 8 },
  playBtn: { width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 },
  playBtnMe: { background: 'rgba(255,255,255,0.2)' },
  msgWaveform: { display: 'flex', alignItems: 'center', gap: 2, height: 30, width: 100 },
  msgWaveBar: { flex: 1, borderRadius: 1, minHeight: 3, transition: 'background 0.1s' },
  msgDuration: { fontSize: 10, color: '#666', flexShrink: 0 },
  msgTime: { fontSize: 10, color: '#444', marginTop: 4, textAlign: 'left' },
  inputBar: { position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, background: '#111', borderTop: '1px solid #1e1e1e', padding: '12px 16px 24px', zIndex: 100 },
  normalBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  holdText: { color: '#444', fontSize: 13 },
  micBtn: { width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#6C63FF,#a855f7)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  recordingBar: { display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '10px 14px' },
  recordDot: { width: 8, height: 8, borderRadius: '50%', background: '#ef4444', flexShrink: 0 },
  recordingText: { color: '#ef4444', fontSize: 14, fontWeight: 700, minWidth: 36 },
  recordWave: { flex: 1, display: 'flex', alignItems: 'center', gap: 3, height: 24 },
  recordWaveBar: { width: 3, borderRadius: 2, background: '#ef4444', opacity: 0.7 },
  stopBtn: { width: 34, height: 34, borderRadius: '50%', background: '#ef4444', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 },
};
