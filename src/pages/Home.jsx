import React, { useState, useRef, useEffect } from 'react';

const Home = ({ navigate, user }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [activeTab, setActiveTab] = useState('feed');
  const [playingId, setPlayingId] = useState(null);
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: 'سارة محمد',
      avatar: 'https://ui-avatars.com/api/?name=سارة+محمد&background=6C63FF&color=fff&bold=true',
      audio: null,
      time: 'منذ دقيقتين',
      duration: '0:42',
      likes: 128,
      comments: 34,
      shares: 12,
      liked: false,
      waveform: [30,50,80,60,90,40,70,55,85,45,65,75,35,90,60,50,80,40,70,55]
    },
    {
      id: 2,
      user: 'محمد أحمد',
      avatar: 'https://ui-avatars.com/api/?name=محمد+أحمد&background=FF6584&color=fff&bold=true',
      audio: null,
      time: 'منذ ساعة',
      duration: '1:15',
      likes: 89,
      comments: 21,
      shares: 7,
      liked: true,
      waveform: [60,40,70,90,30,80,50,75,45,85,55,65,35,90,60,40,80,55,70,45]
    },
    {
      id: 3,
      user: 'نور الهدى',
      avatar: 'https://ui-avatars.com/api/?name=نور+الهدى&background=43B89C&color=fff&bold=true',
      audio: null,
      time: 'منذ 3 ساعات',
      duration: '0:28',
      likes: 234,
      comments: 67,
      shares: 29,
      liked: false,
      waveform: [45,75,55,85,35,65,90,40,70,50,80,60,45,75,30,90,55,65,85,40]
    }
  ]);

  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const timerRef = useRef(null);

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
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
    } catch (err) {
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

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const handleLike = (id) => {
    setPosts(posts.map(p => p.id === id
      ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
      : p
    ));
  };

  const handlePublish = () => {
    if (!audioBlob) return;
    const newPost = {
      id: Date.now(),
      user: user?.name || 'أنت',
      avatar: `https://ui-avatars.com/api/?name=${user?.name || 'أنت'}&background=6C63FF&color=fff&bold=true`,
      audio: audioURL,
      time: 'الآن',
      duration: formatTime(recordingTime),
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
      waveform: Array.from({length: 20}, () => Math.floor(Math.random() * 70) + 20)
    };
    setPosts([newPost, ...posts]);
    setAudioURL(null);
    setAudioBlob(null);
    setRecordingTime(0);
  };

  return (
    <div style={styles.app}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.logo}>صوتي</span>
          <span style={styles.logoSub}>Souty</span>
        </div>
        <div style={styles.headerRight}>
          <button style={styles.iconBtn}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
          <button style={styles.iconBtn}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
          <img
            src={`https://ui-avatars.com/api/?name=${user?.name || 'أ'}&background=6C63FF&color=fff&bold=true`}
            style={styles.headerAvatar}
            onClick={() => navigate('profile')}
            alt="profile"
          />
        </div>
      </header>

      {/* Stories / Quick Actions Bar */}
      <div style={styles.storiesBar}>
        <div style={styles.storyItem}>
          <div style={{...styles.storyCircle, background: 'linear-gradient(135deg, #6C63FF, #a855f7)'}}>
            <span style={styles.plusIcon}>+</span>
          </div>
          <span style={styles.storyLabel}>قصتك</span>
        </div>
        {['ريلز', 'غرف', 'مباشر'].map((label, i) => (
          <div key={i} style={styles.storyItem}>
            <div style={{
              ...styles.storyCircle,
              background: ['linear-gradient(135deg,#FF6584,#FF8E53)', 'linear-gradient(135deg,#43B89C,#1a9e85)', 'linear-gradient(135deg,#f59e0b,#ef4444)'][i]
            }}>
              <span style={{fontSize: 18}}>
                {['🎬','🎙️','📡'][i]}
              </span>
            </div>
            <span style={styles.storyLabel}>{label}</span>
          </div>
        ))}
      </div>

      {/* Record Box */}
      <div style={styles.recordBox}>
        <img
          src={`https://ui-avatars.com/api/?name=${user?.name || 'أ'}&background=6C63FF&color=fff&bold=true`}
          style={styles.recordAvatar}
          alt="user"
        />
        <div style={styles.recordMiddle}>
          {isRecording ? (
            <div style={styles.recordingIndicator}>
              <div style={styles.recordDot} />
              <span style={styles.recordingText}>جاري التسجيل... {formatTime(recordingTime)}</span>
            </div>
          ) : audioURL ? (
            <audio src={audioURL} controls style={styles.audioPreview} />
          ) : (
            <div style={styles.recordPlaceholder}>
              <span style={styles.placeholderText}>شارك صوتك مع العالم...</span>
            </div>
          )}
        </div>
        <button
          style={{...styles.micButton, ...(isRecording ? styles.micRecording : {})}}
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? (
            <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2"/>
            </svg>
          ) : (
            <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/>
            </svg>
          )}
        </button>
      </div>

      {/* Publish bar */}
      {audioURL && (
        <div style={styles.publishBar}>
          <button style={styles.deleteBtn} onClick={() => { setAudioURL(null); setAudioBlob(null); }}>
            🗑 حذف
          </button>
          <button style={styles.publishBtn} onClick={handlePublish}>
            نشر 🌍
          </button>
        </div>
      )}

      {/* Tabs */}
      <div style={styles.tabs}>
        {['feed', 'explore'].map(tab => (
          <button
            key={tab}
            style={{...styles.tab, ...(activeTab === tab ? styles.tabActive : {})}}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'feed' ? 'الخلاصة' : 'استكشاف'}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div style={styles.feed}>
        {posts.map(post => (
          <PostCard key={post.id} post={post} onLike={handleLike} playingId={playingId} setPlayingId={setPlayingId} />
        ))}
      </div>

      {/* Bottom Nav */}
      <nav style={styles.bottomNav}>
        {[
          { icon: HomeIcon, label: 'الرئيسية', active: true, action: () => {} },
          { icon: SearchIcon, label: 'استكشاف', active: false, action: () => {} },
          { icon: RoomsIcon, label: 'الغرف', active: false, action: () => {} },
          { icon: ChatIcon, label: 'المحادثات', active: false, action: () => navigate('messages') },
          { icon: PersonIcon, label: 'حسابي', active: false, action: () => navigate('profile') },
        ].map(({ icon: Icon, label, active, action }, i) => (
          <button key={i} style={styles.navBtn} onClick={action}>
            <Icon active={active} />
            <span style={{...styles.navLabel, ...(active ? styles.navLabelActive : {})}}>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

const PostCard = ({ post, onLike, playingId, setPlayingId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (!post.audio) {
      setIsPlaying(!isPlaying);
      setPlayingId(isPlaying ? null : post.id);
      return;
    }
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Animate waveform progress
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 1));
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  return (
    <div style={styles.postCard}>
      {/* Post Header */}
      <div style={styles.postHeader}>
        <div style={styles.postHeaderLeft}>
          <div style={styles.avatarWrapper}>
            <img src={post.avatar} style={styles.postAvatar} alt="user" />
            <div style={styles.onlineDot} />
          </div>
          <div>
            <div style={styles.postUsername}>{post.user}</div>
            <div style={styles.postTime}>{post.time}</div>
          </div>
        </div>
        <button style={styles.moreBtn}>
          <span style={{fontSize: 18, color: '#666', letterSpacing: 1}}>···</span>
        </button>
      </div>

      {/* Waveform Player */}
      <div style={styles.playerBox}>
        <button style={{...styles.playBtn, ...(isPlaying ? styles.playBtnActive : {})}} onClick={togglePlay}>
          {isPlaying ? (
            <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
            </svg>
          ) : (
            <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
          )}
        </button>

        <div style={styles.waveformContainer}>
          {post.waveform.map((h, i) => {
            const pct = (i / post.waveform.length) * 100;
            const played = pct < progress;
            return (
              <div
                key={i}
                style={{
                  ...styles.waveBar,
                  height: `${h}%`,
                  background: played
                    ? 'linear-gradient(to top, #6C63FF, #a855f7)'
                    : 'rgba(255,255,255,0.15)',
                  transform: isPlaying && Math.abs(pct - progress) < 10 ? 'scaleY(1.2)' : 'scaleY(1)',
                }}
              />
            );
          })}
        </div>

        <span style={styles.duration}>{post.duration}</span>
        {post.audio && <audio ref={audioRef} src={post.audio} />}
      </div>

      {/* Actions */}
      <div style={styles.postActions}>
        <button style={styles.actionBtn} onClick={() => onLike(post.id)}>
          <svg width="18" height="18" fill={post.liked ? '#6C63FF' : 'none'} stroke={post.liked ? '#6C63FF' : '#888'} strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span style={{...styles.actionCount, ...(post.liked ? {color:'#6C63FF'} : {})}}>{post.likes}</span>
        </button>

        <button style={styles.actionBtn}>
          <svg width="18" height="18" fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span style={styles.actionCount}>{post.comments}</span>
        </button>

        <button style={styles.actionBtn}>
          <svg width="18" height="18" fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          <span style={styles.actionCount}>{post.shares}</span>
        </button>

        <button style={styles.actionBtn}>
          <svg width="18" height="18" fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

// Nav Icons
const HomeIcon = ({ active }) => (
  <svg width="22" height="22" fill={active ? '#6C63FF' : 'none'} stroke={active ? '#6C63FF' : '#666'} strokeWidth="2" viewBox="0 0 24 24">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const SearchIcon = ({ active }) => (
  <svg width="22" height="22" fill="none" stroke={active ? '#6C63FF' : '#666'} strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const RoomsIcon = ({ active }) => (
  <svg width="22" height="22" fill="none" stroke={active ? '#6C63FF' : '#666'} strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/>
  </svg>
);
const ChatIcon = ({ active }) => (
  <svg width="22" height="22" fill="none" stroke={active ? '#6C63FF' : '#666'} strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const PersonIcon = ({ active }) => (
  <svg width="22" height="22" fill="none" stroke={active ? '#6C63FF' : '#666'} strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const styles = {
  app: {
    maxWidth: 480,
    margin: '0 auto',
    minHeight: '100vh',
    background: '#0a0a0a',
    color: '#f0f0f0',
    fontFamily: "'Cairo', 'Segoe UI', sans-serif",
    direction: 'rtl',
    paddingBottom: 80,
    position: 'relative',
    overflowX: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 18px',
    background: '#111',
    borderBottom: '1px solid #1e1e1e',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerLeft: { display: 'flex', alignItems: 'baseline', gap: 6 },
  logo: { fontSize: 22, fontWeight: 900, color: '#6C63FF', letterSpacing: -1 },
  logoSub: { fontSize: 13, color: '#555', fontWeight: 400 },
  headerRight: { display: 'flex', alignItems: 'center', gap: 10 },
  iconBtn: {
    background: '#1e1e1e',
    border: 'none',
    color: '#aaa',
    width: 36,
    height: 36,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  headerAvatar: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    cursor: 'pointer',
    border: '2px solid #6C63FF',
  },
  storiesBar: {
    display: 'flex',
    gap: 14,
    padding: '14px 18px',
    overflowX: 'auto',
    background: '#111',
    borderBottom: '1px solid #1e1e1e',
  },
  storyItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
    cursor: 'pointer',
  },
  storyCircle: {
    width: 54,
    height: 54,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
  },
  plusIcon: { fontSize: 26, color: 'white', fontWeight: 300, lineHeight: 1 },
  storyLabel: { fontSize: 11, color: '#888', whiteSpace: 'nowrap' },
  recordBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    background: '#111',
    margin: '10px 14px',
    borderRadius: 16,
    border: '1px solid #1e1e1e',
  },
  recordAvatar: { width: 40, height: 40, borderRadius: '50%', flexShrink: 0 },
  recordMiddle: { flex: 1 },
  recordPlaceholder: {
    background: '#1a1a1a',
    borderRadius: 20,
    padding: '10px 16px',
    cursor: 'text',
  },
  placeholderText: { color: '#555', fontSize: 14 },
  recordingIndicator: { display: 'flex', alignItems: 'center', gap: 8 },
  recordDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: '#ef4444',
    animation: 'blink 1s infinite',
  },
  recordingText: { color: '#ef4444', fontSize: 14 },
  audioPreview: { width: '100%', height: 32 },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: '#6C63FF',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'all 0.2s',
  },
  micRecording: {
    background: '#ef4444',
    animation: 'pulse 1.5s infinite',
  },
  publishBar: {
    display: 'flex',
    gap: 10,
    padding: '0 14px 10px',
  },
  deleteBtn: {
    flex: 1,
    padding: '10px',
    background: 'transparent',
    border: '1px solid #333',
    color: '#888',
    borderRadius: 10,
    cursor: 'pointer',
    fontSize: 14,
  },
  publishBtn: {
    flex: 2,
    padding: '10px',
    background: 'linear-gradient(135deg, #6C63FF, #a855f7)',
    border: 'none',
    color: 'white',
    borderRadius: 10,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 700,
  },
  tabs: {
    display: 'flex',
    padding: '0 14px',
    borderBottom: '1px solid #1e1e1e',
    gap: 0,
  },
  tab: {
    flex: 1,
    padding: '12px 0',
    background: 'none',
    border: 'none',
    color: '#666',
    fontSize: 14,
    cursor: 'pointer',
    fontFamily: 'inherit',
    borderBottom: '2px solid transparent',
  },
  tabActive: {
    color: '#6C63FF',
    borderBottom: '2px solid #6C63FF',
    fontWeight: 700,
  },
  feed: { padding: '6px 0' },
  postCard: {
    background: '#111',
    margin: '8px 14px',
    borderRadius: 18,
    border: '1px solid #1e1e1e',
    overflow: 'hidden',
  },
  postHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px 10px',
  },
  postHeaderLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  avatarWrapper: { position: 'relative' },
  postAvatar: { width: 44, height: 44, borderRadius: '50%', display: 'block' },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    background: '#22c55e',
    borderRadius: '50%',
    border: '2px solid #111',
  },
  postUsername: { fontWeight: 700, fontSize: 14, color: '#f0f0f0' },
  postTime: { fontSize: 11, color: '#555', marginTop: 2 },
  moreBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
  },
  playerBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 16px 14px',
    background: '#0d0d0d',
    margin: '0 12px 12px',
    borderRadius: 14,
  },
  playBtn: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: '#1e1e1e',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'all 0.2s',
  },
  playBtnActive: {
    background: 'linear-gradient(135deg, #6C63FF, #a855f7)',
  },
  waveformContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    height: 40,
  },
  waveBar: {
    flex: 1,
    borderRadius: 2,
    minHeight: 4,
    transition: 'all 0.15s ease',
    transformOrigin: 'center',
  },
  duration: { fontSize: 11, color: '#555', flexShrink: 0 },
  postActions: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px 16px 14px',
    borderTop: '1px solid #1a1a1a',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#888',
    fontSize: 13,
    padding: '6px 12px',
    borderRadius: 8,
    transition: 'background 0.2s',
  },
  actionCount: { color: '#777', fontSize: 13 },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: 480,
    background: '#111',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px 0 20px',
    borderTop: '1px solid #1e1e1e',
    zIndex: 100,
  },
  navBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 16px',
  },
  navLabel: { fontSize: 10, color: '#555' },
  navLabelActive: { color: '#6C63FF' },
};

export default Home;
