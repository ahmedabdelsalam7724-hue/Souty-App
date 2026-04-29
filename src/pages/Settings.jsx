import React, { useState } from 'react';

const ToggleSwitch = ({ value, onChange }) => (
  <div
    onClick={() => onChange(!value)}
    style={{
      width: 44, height: 24, borderRadius: 12,
      background: value ? 'linear-gradient(135deg,#6C63FF,#a855f7)' : '#1e1e1e',
      position: 'relative', cursor: 'pointer',
      transition: 'background 0.3s', flexShrink: 0,
      border: '1px solid ' + (value ? 'transparent' : '#333'),
    }}
  >
    <div style={{
      width: 18, height: 18, borderRadius: '50%',
      background: 'white',
      position: 'absolute',
      top: 2,
      right: value ? 2 : 22,
      transition: 'right 0.3s',
    }} />
  </div>
);

const Section = ({ title, children }) => (
  <div style={s.section}>
    <div style={s.sectionTitle}>{title}</div>
    <div style={s.sectionCard}>{children}</div>
  </div>
);

const Item = ({ icon, label, value, onClick, danger, toggle, toggleValue, onToggle, arrow = true }) => (
  <div style={{ ...s.item, ...(danger ? s.itemDanger : {}) }} onClick={onClick}>
    <div style={s.itemLeft}>
      <div style={{ ...s.itemIcon, ...(danger ? s.itemIconDanger : {}) }}>{icon}</div>
      <span style={{ ...s.itemLabel, ...(danger ? { color: '#ef4444' } : {}) }}>{label}</span>
    </div>
    <div style={s.itemRight}>
      {value && <span style={s.itemValue}>{value}</span>}
      {toggle && <ToggleSwitch value={toggleValue} onChange={onToggle} />}
      {arrow && !toggle && (
        <svg width="16" height="16" fill="none" stroke="#444" strokeWidth="2" viewBox="0 0 24 24">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      )}
    </div>
  </div>
);

export default function Settings({ navigate }) {
  const [toggles, setToggles] = useState({
    notifications: true,
    soundEffects: true,
    darkMode: true,
    privateAccount: false,
    showOnline: true,
    autoPlay: false,
  });

  const toggle = (key) => setToggles(t => ({ ...t, [key]: !t[key] }));

  return (
    <div style={s.screen}>
      {/* Header */}
      <header style={s.header}>
        <button style={s.backBtn} onClick={() => navigate('profile')}>
          <svg width="20" height="20" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <span style={s.headerTitle}>الإعدادات</span>
        <div style={{ width: 36 }} />
      </header>

      <div style={s.content}>
        {/* Profile card */}
        <div style={s.profileCard} onClick={() => navigate('profile')}>
          <img
            src="https://ui-avatars.com/api/?name=أحمد+عبد+السلام&background=6C63FF&color=fff&bold=true&size=80"
            style={s.profileAvatar}
            alt="profile"
          />
          <div style={s.profileInfo}>
            <div style={s.profileName}>أحمد عبد السلام</div>
            <div style={s.profileSub}>عرض ملفك الشخصي وتعديله</div>
          </div>
          <svg width="18" height="18" fill="none" stroke="#555" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>

        {/* Account */}
        <Section title="الحساب">
          <Item icon="📱" label="رقم الهاتف" value="+20 ••• •••• 724" />
          <Item icon="📧" label="البريد الإلكتروني" value="ahmed@..." />
          <Item icon="🔒" label="كلمة المرور" value="تغيير" />
          <Item icon="🌍" label="اللغة" value="العربية" arrow={false} />
        </Section>

        {/* Privacy */}
        <Section title="الخصوصية">
          <Item
            icon="🔐" label="حساب خاص"
            toggle toggleValue={toggles.privateAccount}
            onToggle={() => toggle('privateAccount')} arrow={false}
          />
          <Item
            icon="🟢" label="إظهار حالة الاتصال"
            toggle toggleValue={toggles.showOnline}
            onToggle={() => toggle('showOnline')} arrow={false}
          />
          <Item icon="🚫" label="الحسابات المحظورة" value="3" />
        </Section>

        {/* Notifications */}
        <Section title="الإشعارات">
          <Item
            icon="🔔" label="الإشعارات"
            toggle toggleValue={toggles.notifications}
            onToggle={() => toggle('notifications')} arrow={false}
          />
          <Item
            icon="🔊" label="المؤثرات الصوتية"
            toggle toggleValue={toggles.soundEffects}
            onToggle={() => toggle('soundEffects')} arrow={false}
          />
        </Section>

        {/* Appearance */}
        <Section title="المظهر">
          <Item
            icon="🌙" label="الوضع الداكن"
            toggle toggleValue={toggles.darkMode}
            onToggle={() => toggle('darkMode')} arrow={false}
          />
          <Item
            icon="▶️" label="تشغيل تلقائي للصوت"
            toggle toggleValue={toggles.autoPlay}
            onToggle={() => toggle('autoPlay')} arrow={false}
          />
        </Section>

        {/* Support */}
        <Section title="الدعم">
          <Item icon="❓" label="مركز المساعدة" />
          <Item icon="💬" label="تواصل معنا" />
          <Item icon="⭐" label="قيّم التطبيق" />
          <Item icon="ℹ️" label="عن التطبيق" value="v0.1.0" />
        </Section>

        {/* Danger zone */}
        <Section title="">
          <Item
            icon="🚪" label="تسجيل الخروج"
            danger arrow={false}
            onClick={() => navigate('login')}
          />
          <Item
            icon="🗑️" label="حذف الحساب"
            danger arrow={false}
          />
        </Section>

        <div style={{ height: 40 }} />
      </div>
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
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 18px',
    background: '#111',
    borderBottom: '1px solid #1e1e1e',
    position: 'sticky',
    top: 0, zIndex: 100,
  },
  headerTitle: { fontSize: 16, fontWeight: 700, color: '#f0f0f0' },
  backBtn: {
    background: '#1a1a1a', border: 'none',
    width: 36, height: 36, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
  },
  content: { padding: '16px 14px' },
  profileCard: {
    display: 'flex', alignItems: 'center', gap: 14,
    background: '#111',
    border: '1px solid #1e1e1e',
    borderRadius: 16,
    padding: '16px',
    marginBottom: 20,
    cursor: 'pointer',
  },
  profileAvatar: {
    width: 52, height: 52, borderRadius: '50%',
    border: '2px solid #6C63FF',
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 15, fontWeight: 700, color: '#f0f0f0' },
  profileSub: { fontSize: 12, color: '#555', marginTop: 2 },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 11, color: '#444', fontWeight: 600,
    marginBottom: 8, paddingRight: 4,
    textTransform: 'uppercase', letterSpacing: 1,
  },
  sectionCard: {
    background: '#111',
    border: '1px solid #1e1e1e',
    borderRadius: 16,
    overflow: 'hidden',
  },
  item: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    borderBottom: '1px solid #161616',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  itemDanger: { borderBottom: '1px solid #1a0a0a' },
  itemLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  itemIcon: {
    width: 34, height: 34, borderRadius: 10,
    background: '#1a1a1a',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16,
  },
  itemIconDanger: { background: 'rgba(239,68,68,0.1)' },
  itemLabel: { fontSize: 14, color: '#d0d0d0' },
  itemRight: { display: 'flex', alignItems: 'center', gap: 8 },
  itemValue: { fontSize: 13, color: '#555' },
};
