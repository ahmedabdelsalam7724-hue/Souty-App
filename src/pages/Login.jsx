import React, { useState } from 'react';

export default function Login({ navigate }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (key, val) => setFormData(f => ({ ...f, [key]: val }));

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError('من فضلك اكتب البيانات كلها');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('home');
    }, 1500);
  };

  return (
    <div style={s.screen}>
      {/* Background blobs */}
      <div style={s.blob1} />
      <div style={s.blob2} />

      <div style={s.card}>
        {/* Logo */}
        <div style={s.logoBlock}>
          <div style={s.logoIcon}>
            <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/>
            </svg>
          </div>
          <h1 style={s.logoText}>صوتي</h1>
          <p style={s.logoSub}>تواصل بصوتك مع العالم</p>
        </div>

        {/* Fields */}
        <div style={s.fields}>
          <div style={s.label}>البريد الإلكتروني</div>
          <div style={s.inputWrapper}>
            <svg width="16" height="16" fill="none" stroke="#555" strokeWidth="2" viewBox="0 0 24 24" style={s.inputIcon}>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <input
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={e => update('email', e.target.value)}
              style={s.input}
            />
          </div>

          <div style={s.label}>كلمة المرور</div>
          <div style={{ ...s.inputWrapper, paddingLeft: 10 }}>
            <svg width="16" height="16" fill="none" stroke="#555" strokeWidth="2" viewBox="0 0 24 24" style={s.inputIcon}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="كلمة المرور"
              value={formData.password}
              onChange={e => update('password', e.target.value)}
              style={{ ...s.input, flex: 1 }}
            />
            <button style={s.eyeBtn} onClick={() => setShowPass(!showPass)}>
              {showPass
                ? <svg width="17" height="17" fill="none" stroke="#555" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                : <svg width="17" height="17" fill="none" stroke="#555" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              }
            </button>
          </div>

          <div style={s.forgotRow}>
            <span style={s.forgotLink}>نسيت كلمة المرور؟</span>
          </div>

          {error && <div style={s.errorBox}>{error}</div>}
        </div>

        {/* Login button */}
        <button style={s.loginBtn} onClick={handleLogin} disabled={loading}>
          {loading ? (
            <div style={s.spinner} />
          ) : (
            <>
              <span>تسجيل الدخول</span>
              <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </>
          )}
        </button>

        {/* Divider */}
        <div style={s.divider}>
          <div style={s.dividerLine} />
          <span style={s.dividerText}>أو</span>
          <div style={s.dividerLine} />
        </div>

        {/* Social login */}
        <div style={s.socialRow}>
          <button style={s.socialBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span style={s.socialText}>Google</span>
          </button>
          <button style={s.socialBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span style={s.socialText}>Facebook</span>
          </button>
        </div>

        {/* Register link */}
        <p style={s.registerLink}>
          مش عندك حساب؟{' '}
          <span style={s.registerLinkText} onClick={() => navigate('register')}>
            سجل دلوقتي
          </span>
        </p>
      </div>
    </div>
  );
}

const s = {
  screen: {
    minHeight: '100vh',
    background: '#0a0a0a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Cairo', 'Segoe UI', sans-serif",
    direction: 'rtl',
    position: 'relative',
    overflow: 'hidden',
    padding: '20px 16px',
  },
  blob1: {
    position: 'fixed', top: -120, right: -120,
    width: 350, height: 350, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(108,99,255,0.18), transparent 70%)',
    pointerEvents: 'none',
  },
  blob2: {
    position: 'fixed', bottom: -100, left: -100,
    width: 300, height: 300, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(168,85,247,0.12), transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    background: '#111',
    borderRadius: 24,
    padding: '36px 24px 32px',
    border: '1px solid #1e1e1e',
    position: 'relative',
    zIndex: 1,
  },
  logoBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
  logoIcon: {
    width: 64, height: 64, borderRadius: 20,
    background: 'linear-gradient(135deg, #6C63FF, #a855f7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  logoText: {
    fontSize: 26, fontWeight: 900, color: '#f0f0f0',
    margin: 0, letterSpacing: -1,
  },
  logoSub: {
    fontSize: 13, color: '#555', margin: 0,
  },
  fields: {
    display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20,
  },
  label: { fontSize: 12, color: '#666', marginBottom: -4 },
  inputWrapper: {
    background: '#1a1a1a',
    border: '1px solid #252525',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    paddingRight: 12,
    transition: 'border 0.2s',
  },
  inputIcon: { flexShrink: 0, marginLeft: 8 },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    padding: '13px 12px',
    color: '#f0f0f0',
    fontSize: 14,
    fontFamily: 'inherit',
  },
  eyeBtn: {
    background: 'none', border: 'none',
    cursor: 'pointer', padding: 6,
    display: 'flex', alignItems: 'center',
  },
  forgotRow: {
    display: 'flex', justifyContent: 'flex-start',
    marginTop: -4,
  },
  forgotLink: {
    fontSize: 12, color: '#6C63FF', cursor: 'pointer',
  },
  errorBox: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#ef4444',
    fontSize: 13,
    textAlign: 'center',
  },
  loginBtn: {
    width: '100%',
    padding: '15px',
    background: 'linear-gradient(135deg, #6C63FF, #a855f7)',
    border: 'none',
    borderRadius: 12,
    color: 'white',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    fontFamily: 'inherit',
    marginBottom: 20,
    transition: 'opacity 0.2s',
  },
  spinner: {
    width: 20, height: 20,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  divider: {
    display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16,
  },
  dividerLine: { flex: 1, height: 1, background: '#1e1e1e' },
  dividerText: { fontSize: 12, color: '#444' },
  socialRow: {
    display: 'flex', gap: 12, marginBottom: 24,
  },
  socialBtn: {
    flex: 1,
    background: '#1a1a1a',
    border: '1px solid #252525',
    borderRadius: 10,
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'background 0.2s',
  },
  socialText: { color: '#aaa', fontSize: 13, fontWeight: 600 },
  registerLink: {
    textAlign: 'center', color: '#555',
    fontSize: 13, margin: 0,
  },
  registerLinkText: {
    color: '#6C63FF', cursor: 'pointer', fontWeight: 700,
  },
};
