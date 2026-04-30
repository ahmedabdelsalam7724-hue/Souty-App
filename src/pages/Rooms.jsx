import React, { useState, useEffect, useRef } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

const AGORA_APP_ID = 'cf007467a5bf403e88d3a4cc56f7a739';

const mockRooms = [
  { id: 'room_1', name: 'نقاشات التكنولوجيا', host: 'أحمد', members: 12, tags: ['تقنية', 'برمجة'], live: true },
  { id: 'room_2', name: 'موسيقى وفن', host: 'سارة', members: 8, tags: ['موسيقى', 'فن'], live: true },
  { id: 'room_3', name: 'ريادة الأعمال', host: 'محمد', members: 24, tags: ['أعمال', 'استثمار'], live: true },
  { id: 'room_4', name: 'تعلم اللغات', host: 'نور', members: 5, tags: ['لغات', 'تعليم'], live: false },
];

export default function Rooms({ navigate, user }) {
  const [rooms, setRooms] = useState(mockRooms);
  const [activeRoom, setActiveRoom] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [members, setMembers] = useState([]);
  const [isJoining, setIsJoining] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  const clientRef = useRef(null);
  const localTrackRef = useRef(null);

  const joinRoom = async (room) => {
    setIsJoining(true);
    try {
      const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      clientRef.current = client;

      // في الإنتاج الحقيقي، الـ token بييجي من السيرفر
      await client.join(AGORA_APP_ID, room.id, null, user?.name || 'مستخدم');

      const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      localTrackRef.current = localAudioTrack;
      await client.publish([localAudioTrack]);

      client.on('user-published', async (remoteUser, mediaType) => {
        await client.subscribe(remoteUser, mediaType);
        if (mediaType === 'audio') remoteUser.audioTrack?.play();
        setMembers(prev => [...prev.filter(m => m.uid !== remoteUser.uid), remoteUser]);
      });

      client.on('user-unpublished', (remoteUser) => {
        setMembers(prev => prev.filter(m => m.uid !== remoteUser.uid));
      });

      setActiveRoom(room);
      setMembers([{ uid: 'me', name: user?.name || 'أنت' }]);
    } catch (err) {
      console.error('Join error:', err);
      alert('تأكد من تفعيل المايك وإن التطبيق مربوط بالإنترنت');
    }
    setIsJoining(false);
  };

  const leaveRoom = async () => {
    if (localTrackRef.current) {
      localTrackRef.current.stop();
      localTrackRef.current.close();
    }
    if (clientRef.current) {
      await clientRef.current.leave();
    }
    setActiveRoom(null);
    setMembers([]);
    setIsMuted(false);
  };

  const toggleMute = () => {
    if (localTrackRef.current) {
      localTrackRef.current.setEnabled(isMuted);
      setIsMuted(!isMuted);
    }
  };

  const createRoom = () => {
    if (!newRoomName.trim()) return;
    const newRoom = {
      id: `room_${Date.now()}`,
      name: newRoomName,
      host: user?.name || 'أنت',
      members: 1,
      tags: ['جديد'],
      live: true,
    };
    setRooms([newRoom, ...rooms]);
    setNewRoomName('');
    setShowCreateModal(false);
    joinRoom(newRoom);
  };

  useEffect(() => {
    return () => { leaveRoom(); };
  }, []);

  return (
    <div style={s.screen}>
      {/* Header */}
      <header style={s.header}>
        <button style={s.backBtn} onClick={() => navigate('home')}>
          <svg width="20" height="20" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <span style={s.headerTitle}>الغرف الصوتية 🎙️</span>
        <button style={s.createBtn} onClick={() => setShowCreateModal(true)}>+ غرفة</button>
      </header>

      {/* Active Room Bar */}
      {activeRoom && (
        <div style={s.activeBar}>
          <div style={s.activeBarLeft}>
            <div style={s.liveDot} />
            <span style={s.activeName}>{activeRoom.name}</span>
            <span style={s.memberCount}>{members.length} 👤</span>
          </div>
          <div style={s.activeBarRight}>
            <button style={{ ...s.controlBtn, ...(isMuted ? s.mutedBtn : {}) }} onClick={toggleMute}>
              {isMuted
                ? <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23M12 19v4M8 23h8"/></svg>
                : <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/></svg>
              }
            </button>
            <button style={s.leaveBtn} onClick={leaveRoom}>خروج</button>
          </div>
        </div>
      )}

      {/* Rooms List */}
      <div style={s.content}>
        <div style={s.sectionTitle}>الغرف المباشرة 🔴</div>
        {rooms.filter(r => r.live).map(room => (
          <RoomCard
            key={room.id}
            room={room}
            isActive={activeRoom?.id === room.id}
            onJoin={() => activeRoom?.id !== room.id && joinRoom(room)}
            isJoining={isJoining}
            members={activeRoom?.id === room.id ? members : []}
          />
        ))}

        <div style={{ ...s.sectionTitle, marginTop: 20 }}>غرف أخرى</div>
        {rooms.filter(r => !r.live).map(room => (
          <RoomCard key={room.id} room={room} onJoin={() => joinRoom(room)} isJoining={isJoining} members={[]} />
        ))}
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div style={s.modalOverlay}>
          <div style={s.modal}>
            <h3 style={s.modalTitle}>إنشاء غرفة جديدة</h3>
            <input
              type="text"
              placeholder="اسم الغرفة..."
              value={newRoomName}
              onChange={e => setNewRoomName(e.target.value)}
              style={s.modalInput}
              autoFocus
            />
            <div style={s.modalBtns}>
              <button style={s.cancelBtn} onClick={() => setShowCreateModal(false)}>إلغاء</button>
              <button style={s.confirmBtn} onClick={createRoom}>إنشاء 🚀</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const RoomCard = ({ room, isActive, onJoin, isJoining, members }) => (
  <div style={{ ...s.roomCard, ...(isActive ? s.roomCardActive : {}) }}>
    <div style={s.roomTop}>
      <div style={s.roomInfo}>
        <div style={s.roomName}>{room.name}</div>
        <div style={s.roomHost}>المضيف: {room.host}</div>
      </div>
      <button
        style={{ ...s.joinBtn, ...(isActive ? s.joinedBtn : {}) }}
        onClick={onJoin}
        disabled={isJoining}
      >
        {isActive ? '✓ داخل' : isJoining ? '...' : 'دخول'}
      </button>
    </div>

    <div style={s.roomTags}>
      {room.tags.map(tag => (
        <span key={tag} style={s.tag}>{tag}</span>
      ))}
    </div>

    <div style={s.roomFooter}>
      <div style={s.roomMembers}>
        {isActive && members.length > 0
          ? members.slice(0, 5).map((m, i) => (
              <div key={i} style={{ ...s.memberAvatar, zIndex: 5 - i, marginRight: i > 0 ? -8 : 0 }}>
                {(m.name || '؟')[0]}
              </div>
            ))
          : <span style={s.memberCountText}>{room.members} عضو</span>
        }
      </div>
      {room.live && <div style={s.liveTag}><div style={s.liveDotSmall} /> مباشر</div>}
    </div>
  </div>
);

const s = {
  screen: { maxWidth: 480, margin: '0 auto', minHeight: '100vh', background: '#0a0a0a', color: '#f0f0f0', fontFamily: "'Cairo','Segoe UI',sans-serif", direction: 'rtl', paddingBottom: 30 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: '#111', borderBottom: '1px solid #1e1e1e', position: 'sticky', top: 0, zIndex: 100 },
  headerTitle: { fontSize: 16, fontWeight: 700 },
  backBtn: { background: '#1a1a1a', border: 'none', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  createBtn: { background: 'linear-gradient(135deg,#6C63FF,#a855f7)', border: 'none', color: 'white', padding: '8px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit' },
  activeBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(108,99,255,0.15)', borderBottom: '1px solid rgba(108,99,255,0.3)' },
  activeBarLeft: { display: 'flex', alignItems: 'center', gap: 8 },
  activeBarRight: { display: 'flex', alignItems: 'center', gap: 8 },
  liveDot: { width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite' },
  activeName: { fontSize: 14, fontWeight: 600 },
  memberCount: { fontSize: 12, color: '#aaa' },
  controlBtn: { width: 34, height: 34, borderRadius: '50%', background: '#6C63FF', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  mutedBtn: { background: '#ef4444' },
  leaveBtn: { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' },
  content: { padding: '16px 14px' },
  sectionTitle: { fontSize: 12, color: '#555', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  roomCard: { background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: 16, marginBottom: 10, transition: 'all 0.2s' },
  roomCardActive: { border: '1px solid rgba(108,99,255,0.5)', background: 'rgba(108,99,255,0.05)' },
  roomTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  roomInfo: { flex: 1 },
  roomName: { fontSize: 15, fontWeight: 700, marginBottom: 4 },
  roomHost: { fontSize: 12, color: '#666' },
  joinBtn: { background: 'linear-gradient(135deg,#6C63FF,#a855f7)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', flexShrink: 0 },
  joinedBtn: { background: '#1a1a1a', color: '#6C63FF', border: '1px solid #6C63FF' },
  roomTags: { display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' },
  tag: { background: '#1a1a1a', border: '1px solid #252525', color: '#888', padding: '3px 10px', borderRadius: 20, fontSize: 11 },
  roomFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  roomMembers: { display: 'flex', alignItems: 'center' },
  memberAvatar: { width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#6C63FF,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, border: '2px solid #111', position: 'relative' },
  memberCountText: { fontSize: 12, color: '#555' },
  liveTag: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#ef4444' },
  liveDotSmall: { width: 6, height: 6, borderRadius: '50%', background: '#ef4444' },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20 },
  modal: { background: '#161616', border: '1px solid #252525', borderRadius: 20, padding: 24, width: '100%', maxWidth: 340 },
  modalTitle: { fontSize: 18, fontWeight: 800, margin: '0 0 16px', color: '#f0f0f0' },
  modalInput: { width: '100%', background: '#1a1a1a', border: '1px solid #252525', borderRadius: 10, padding: '12px 14px', color: '#f0f0f0', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 16 },
  modalBtns: { display: 'flex', gap: 10 },
  cancelBtn: { flex: 1, padding: '11px', background: '#1a1a1a', border: '1px solid #252525', borderRadius: 10, color: '#888', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 },
  confirmBtn: { flex: 2, padding: '11px', background: 'linear-gradient(135deg,#6C63FF,#a855f7)', border: 'none', borderRadius: 10, color: 'white', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 700 },
};
