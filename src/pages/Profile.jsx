import React, { useState } from 'react';

const mockPosts = [
  { id: 1, duration: '0:45', likes: 128, comments: 34, time: 'منذ يومين', waveform: [30,50,80,60,90,40,70,55,85,45,65,75,35,90,60,50,80,40,70,55] },
  { id: 2, duration: '1:12', likes: 89,  comments: 21, time: 'منذ أسبوع', waveform: [60,40,70,90,30,80,50,75,45,85,55,65,35,90,60,40,80,55,70,45] },
  { id: 3, duration: '0:33', likes: 234, comments: 67, time: 'منذ أسبوعين', waveform: [45,75,55,85,35,65,90,40,70,50,80,60,45,75,30,90,55,65,85,40] },
];

export default function Profile({ navigate, user }) {
  const [activeTab, setActiveTab] = useState('posts');
  const [followed, setFollowed] = useState(false);
  const [playingId, setPlayingId] = useState(null);

  const u = user || {
    name: 'أحمد عبد السلام',
    followers: 1250,
    following: 450,
    degree: 'طالب هندسة',
    skills: 'React, UI/UX',
  };

  return (
    <div style={s.screen}>
      {/* Header */}
      <header style={s.header}>
        <button style={s.iconBtn} onClick={() => navigate('home')}>
          <svg width="20" height="20" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <span style={s.headerTitle}>{u.name}</span>
        <button style={s.iconBtn} onClick={() => navigate('settings')}>
          <svg width="20" height="20" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      </header>

      {/* Cover + Avatar */}
      <div style={s.coverArea}>
        <div style={s.cover} />
        <div style={s.avatarArea}>
          <div style={s.avatarRing}>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=6C63FF&color=fff&bold=true&size=128`}
              style={s.avatar}
              alt="profile"
            />
          </div>
          <div style={s.onlineBadge}>🎙️</div>
        </div>
      </div>

      {/* Info */}
      <div style={s.infoBlock}>
        <h2 style={s.name}>{u.name}</h2>
        <p style={s.bio}>{u.degree} · {u.skills}</p>

        {/* Stats */}
        <div style={s.statsRow}>
          {[
            { label: 'منشور', value: mockPosts.length },
            { label: 'متابع', value: u.followers.toLocaleString('ar-EG') },
            { label: 'يتابع', value: u.following.toLocaleString('ar-EG') },
          ].map((stat, i) => (
            <div key={i} style={s.stat}>
              <span style={s.statVal}>{stat.value}</span>
              <span style={s.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div style={s.actionRow}>
          <button
            style={{ ...s.followBtn, ...(followed ? s.followingBtn : {}) }}
            onClick={() => setFollowed(!followed)}
          >
            {followed ? '✓ تتابعه' : '+ تابع'}
          </button>
          <button style={s.msgBtn}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            </svg>
            رسالة صوتية
          </button>
          <button style={s.moreBtn}>
            <svg width="18" height="18" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={s.tabs}>
        {[
          { key: 'posts', icon: '🎙️', label: 'المنشورات' },
          { key: 'reels', icon: '🎬', label: 'الريلز' },
          { key: 'saved', icon: '🔖', label: 'المحفوظات' },
        ].map(tab => (
          <button
            key={tab.key}
            style={{ ...s.tab, ...(activeTab === tab.key ? s.tabActive : {}) }}
            onClick={() => setActiveTab(tab.key)}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Posts */}
      {activeTab === 'posts' && (
        <div style={s.postsList}>
          {mockPosts.map(post => (
            <div key={post.id} style={s.postCard}>
              {/* Waveform player */}
              <div style={s.playerRow}>
                <button
                  style={{ ...s.playBtn, ...(playingId === post.id ? s.playBtnActive : {}) }}
                  onClick={() => setPlayingId(playingId === post.id ? null : post.id)}
                >
                  {playingId === post.id
                    ? <svg width="14" height="14" fill="white" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                    : <svg width="14" height="14" fill="white" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>
                  }
                </button>
                <div style={s.waveform}>
                  {post.waveform.map((h, i) => (
                    <div key={i} style={{
                      ...s.waveBar,
                      height: `${h}%`,
                      background: playingId === post.id && i < 8
                        ? 'linear-gradient(to top,#6C63FF,#a855f7)'
                        : 'rgba(255,255,255,0.12)',
                    }} />
                  ))}
                </div>
                <span style={s.duration}>{post.duration}</span>
              </div>

              {/* Post footer */}
              <div style={s.postFooter}>
                <span style={s.postTime}>{post.time}</span>
                <div style={s.postStats}>
                  <span style={s.postStat}>
                    <svg width="13" height="13" fill="none" stroke="#666" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    {post.likes}
                  </span>
                  <span style={s.postStat}>
                    <svg width="13" height="13" fill="none" stroke="#666" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    {post.comments}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reels / Saved - empty state */}
      {(activeTab === 'reels' || activeTab === 'saved') && (
        <div style={s.emptyState}>
          <span style={s.emptyIcon}>{activeTab === 'reels' ? '🎬' : '🔖'}</span>
          <p style={s.emptyText}>
            {activeTab === 'reels' ? 'مفيش ريلز لسه' : 'مفيش محفوظات لسه'}
          </p>
        </div>
      )}

      {/* Bottom padding */}
      <div style={{ height: 40 }} />
    </div>
  );
}

const s = {
  screen: {
    maxWidth: 480,
    margin: '0 auto',
    minHeight: '100vh',
    background: '#0a0a0a',
    color: '#f0f0f0',
    fontFamily: "'Cairo', 'Segoe UI', sans-serif",
    direction: 'rtl',
    position: 'relative',
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
  headerTitle: { fontSize: 16, fontWeight: 700, color: '#f0f0f0' },
  iconBtn: {
    background: '#1a1a1a',
    border: 'none',
    width: 36, height: 36,
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
  },
  coverArea: {
    position: 'relative',
    marginBottom: 50,
  },
  cover: {
    height: 130,
    background: 'linear-gradient(135deg, #1a1040, #0d0d1a, #1a0d2e)',
    position: 'relative',
    overflow: 'hidden',
  },
  avatarArea: {
    position: 'absolute',
    bottom: -44,
    right: 20,
  },
  avatarRing: {
    width: 88, height: 88,
    borderRadius: '50%',
    padding: 3,
    background: 'linear-gradient(135deg, #6C63FF, #a855f7)',
  },
  avatar: {
    width: '100%', height: '100%',
    borderRadius: '50%',
    display: 'block',
    border: '3px solid #0a0a0a',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2, left: 2,
    fontSize: 16,
    background: '#111',
    borderRadius: '50%',
    width: 26, height: 26,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  infoBlock: {
    padding: '0 18px 16px',
  },
  name: {
    fontSize: 20, fontWeight: 800,
    margin: '0 0 4px', color: '#f0f0f0',
  },
  bio: {
    fontSize: 13, color: '#666', margin: '0 0 16px',
  },
  statsRow: {
    display: 'flex',
    gap: 0,
    marginBottom: 16,
    background: '#111',
    borderRadius: 14,
    border: '1px solid #1e1e1e',
    overflow: 'hidden',
  },
  stat: {
    flex: 1,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center',
    padding: '12px 0',
    borderLeft: '1px solid #1e1e1e',
  },
  statVal: { fontSize: 17, fontWeight: 800, color: '#f0f0f0' },
  statLabel: { fontSize: 11, color: '#555', marginTop: 2 },
  actionRow: {
    display: 'flex', gap: 10, alignItems: 'center',
  },
  followBtn: {
    flex: 1,
    padding: '11px',
    background: 'linear-gradient(135deg, #6C63FF, #a855f7)',
    border: 'none',
    borderRadius: 10,
    color: 'white',
    fontSize: 14, fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
  },
  followingBtn: {
    background: '#1a1a1a',
    border: '1px solid #333',
    color: '#aaa',
  },
  msgBtn: {
    flex: 1,
    padding: '11px',
    background: '#1a1a1a',
    border: '1px solid #252525',
    borderRadius: 10,
    color: '#aaa',
    fontSize: 14, fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: 6,
  },
  moreBtn: {
    width: 42, height: 42,
    background: '#1a1a1a',
    border: '1px solid #252525',
    borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', flexShrink: 0,
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #1e1e1e',
    background: '#111',
  },
  tab: {
    flex: 1, padding: '12px 0',
    background: 'none', border: 'none',
    color: '#555', fontSize: 13,
    cursor: 'pointer', fontFamily: 'inherit',
    borderBottom: '2px solid transparent',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: 5,
    transition: 'all 0.2s',
  },
  tabActive: {
    color: '#6C63FF',
    borderBottom: '2px solid #6C63FF',
    fontWeight: 700,
  },
  postsList: { padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 10 },
  postCard: {
    background: '#111',
    borderRadius: 16,
    border: '1px solid #1e1e1e',
    padding: '14px',
  },
  playerRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    background: '#0d0d0d', borderRadius: 12,
    padding: '10px 12px', marginBottom: 10,
  },
  playBtn: {
    width: 36, height: 36, borderRadius: '50%',
    background: '#1e1e1e', border: 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s',
  },
  playBtnActive: {
    background: 'linear-gradient(135deg, #6C63FF, #a855f7)',
  },
  waveform: {
    flex: 1, display: 'flex', alignItems: 'center',
    gap: 2, height: 36,
  },
  waveBar: {
    flex: 1, borderRadius: 2, minHeight: 4,
    transition: 'background 0.2s',
  },
  duration: { fontSize: 11, color: '#555', flexShrink: 0 },
  postFooter: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  postTime: { fontSize: 11, color: '#444' },
  postStats: { display: 'flex', gap: 14 },
  postStat: {
    display: 'flex', alignItems: 'center', gap: 4,
    fontSize: 12, color: '#666',
  },
  emptyState: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '60px 20px', gap: 12,
  },
  emptyIcon: { fontSize: 48 },
  emptyText: { color: '#444', fontSize: 14, margin: 0 },
};
