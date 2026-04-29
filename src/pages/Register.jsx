import React, { useState } from 'react';

const steps = [
  { title: 'رقم هاتفك', subtitle: 'هنبعتلك كود تأكيد' },
  { title: 'بياناتك الأساسية', subtitle: 'عرّف العالم بنفسك' },
  { title: 'تاريخ ميلادك', subtitle: 'وكلمة سر قوية' },
  { title: 'تأكيد الحساب', subtitle: 'خطوة أخيرة وخلصنا 🎉' },
];

const countries = [
  { name: 'مصر', code: '+20', flag: '🇪🇬' },
  { name: 'السعودية', code: '+966', flag: '🇸🇦' },
  { name: 'الإمارات', code: '+971', flag: '🇦🇪' },
  { name: 'المغرب', code: '+212', flag: '🇲🇦' },
  { name: 'الكويت', code: '+965', flag: '🇰🇼' },
  { name: 'قطر', code: '+974', flag: '🇶🇦' },
];

export default function Register({ navigate }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    country: countries[0],
    phone: '',
    name: '',
    email: '',
    birthdate: '',
    password: '',
    confirmPassword: '',
  });
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const update = (key, val) => setFormData(f => ({ ...f, [key]: val }));

  const next = () => {
    if (step < 4) setStep(s => s + 1);
    else navigate('home');
  };
  const back = () => {
    if (step > 1) setStep(s => s - 1);
    else navigate('login');
  };

  const progressPct = ((step - 1) / 3) * 100;

  return (
    <div style={s.screen}>
      {/* Background blobs */}
      <div style={s.blob1} />
      <div style={s.blob2} />

      <div style={s.card}>
        {/* Top bar */}
        <div style={s.topBar}>
          <button style={s.backBtn} onClick={back}>
            <svg width="20" height="20" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div style={s.stepIndicator}>
            {[1,2,3,4].map(n => (
              <div key={n} style={{
                ...s.stepDot,
                background: n <= step ? '#6C63FF' : '#1e1e1e',
                width: n === step ? 20 : 8,
              }} />
            ))}
          </div>
          <span style={s.stepText}>{step}/4</span>
        </div>

        {/* Progress bar */}
        <div style={s.progressBg}>
          <div style={{ ...s.progressFill, width: `${progressPct + 33}%` }} />
        </div>

        {/* Title */}
        <div style={s.titleBlock}>
          <h2 style={s.title}>{steps[step - 1].title}</h2>
          <p style={s.subtitle}>{steps[step - 1].subtitle}</p>
        </div>

        {/* Step 1: Phone */}
        {step === 1 && (
          <div style={s.fields}>
            {/* Country picker */}
            <div style={s.label}>الدولة</div>
            <button style={s.countryBtn} onClick={() => setShowCountryPicker(!showCountryPicker)}>
              <span style={s.flag}>{formData.country.flag}</span>
              <span style={s.countryName}>{formData.country.name}</span>
              <span style={s.countryCode}>{formData.country.code}</span>
              <svg width="16" height="16" fill="none" stroke="#555" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: 'auto' }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {showCountryPicker && (
              <div style={s.dropdown}>
                {countries.map(c => (
                  <button key={c.code} style={s.dropdownItem} onClick={() => {
                    update('country', c);
                    setShowCountryPicker(false);
                  }}>
                    <span>{c.flag}</span>
                    <span style={{ flex: 1, textAlign: 'right' }}>{c.name}</span>
                    <span style={{ color: '#555', fontSize: 13 }}>{c.code}</span>
                  </button>
                ))}
              </div>
            )}

            <div style={s.label}>رقم الهاتف</div>
            <div style={s.phoneRow}>
              <span style={s.phoneCode}>{formData.country.code}</span>
              <input
                type="tel"
                placeholder="01xxxxxxxxx"
                value={formData.phone}
                onChange={e => update('phone', e.target.value)}
                style={{ ...s.input, flex: 1, borderRadius: '0 10px 10px 0' }}
              />
            </div>
          </div>
        )}

        {/* Step 2: Name & Email */}
        {step === 2 && (
          <div style={s.fields}>
            <div style={s.label}>الاسم الكامل</div>
            <input
              type="text"
              placeholder="مثال: أحمد محمد"
              value={formData.name}
              onChange={e => update('name', e.target.value)}
              style={s.input}
            />
            <div style={s.label}>البريد الإلكتروني</div>
            <input
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={e => update('email', e.target.value)}
              style={s.input}
            />
          </div>
        )}

        {/* Step 3: Birthdate & Password */}
        {step === 3 && (
          <div style={s.fields}>
            <div style={s.label}>تاريخ الميلاد</div>
            <input
              type="date"
              value={formData.birthdate}
              onChange={e => update('birthdate', e.target.value)}
              style={{ ...s.input, colorScheme: 'dark' }}
            />
            <div style={s.label}>كلمة المرور</div>
            <div style={s.passRow}>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="8 أحرف على الأقل"
                value={formData.password}
                onChange={e => update('password', e.target.value)}
                style={{ ...s.input, flex: 1, border: 'none', background: 'transparent', outline: 'none', color: '#f0f0f0' }}
              />
              <button style={s.eyeBtn} onClick={() => setShowPass(!showPass)}>
                {showPass
                  ? <svg width="18" height="18" fill="none" stroke="#555" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="18" height="18" fill="none" stroke="#555" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>

            {/* Password strength */}
            {formData.password.length > 0 && (
              <div style={s.strengthBar}>
                {[1,2,3,4].map(n => (
                  <div key={n} style={{
                    ...s.strengthSeg,
                    background: formData.password.length >= n * 2
                      ? n <= 1 ? '#ef4444' : n <= 2 ? '#f59e0b' : n <= 3 ? '#22c55e' : '#6C63FF'
                      : '#1e1e1e'
                  }} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <div style={s.fields}>
            <div style={s.confirmSummary}>
              <div style={s.summaryAvatar}>
                {formData.name ? formData.name[0] : '؟'}
              </div>
              <div style={s.summaryName}>{formData.name || 'اسمك'}</div>
              <div style={s.summaryEmail}>{formData.email || 'بريدك'}</div>
            </div>

            <div style={s.label}>تأكيد كلمة المرور</div>
            <div style={s.passRow}>
              <input
                type={showConfirmPass ? 'text' : 'password'}
                placeholder="أعد كتابة كلمة المرور"
                value={formData.confirmPassword}
                onChange={e => update('confirmPassword', e.target.value)}
                style={{ ...s.input, flex: 1, border: 'none', background: 'transparent', outline: 'none', color: '#f0f0f0' }}
              />
              <button style={s.eyeBtn} onClick={() => setShowConfirmPass(!showConfirmPass)}>
                <svg width="18" height="18" fill="none" stroke="#555" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>

            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p style={{ color: '#ef4444', fontSize: 12, marginTop: -8 }}>كلمتا المرور غير متطابقتين</p>
            )}
          </div>
        )}

        {/* Next button */}
        <button style={s.nextBtn} onClick={next}>
          <span>{step === 4 ? 'إنشاء الحساب 🚀' : 'التالي'}</span>
          {step < 4 && (
            <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          )}
        </button>

        {step === 1 && (
          <p style={s.loginLink}>
            عندك حساب بالفعل؟{' '}
            <span style={s.loginLinkText} onClick={() => navigate('login')}>سجل دخول</span>
          </p>
        )}
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
    position: 'fixed', top: -100, right: -100,
    width: 300, height: 300, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(108,99,255,0.15), transparent 70%)',
    pointerEvents: 'none',
  },
  blob2: {
    position: 'fixed', bottom: -80, left: -80,
    width: 250, height: 250, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(168,85,247,0.1), transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    background: '#111',
    borderRadius: 24,
    padding: '24px 24px 32px',
    border: '1px solid #1e1e1e',
    position: 'relative',
    zIndex: 1,
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backBtn: {
    background: '#1a1a1a',
    border: 'none',
    width: 36, height: 36,
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
  },
  stepIndicator: { display: 'flex', alignItems: 'center', gap: 6 },
  stepDot: {
    height: 8, borderRadius: 4,
    transition: 'all 0.3s ease',
  },
  stepText: { fontSize: 13, color: '#555' },
  progressBg: {
    height: 3, background: '#1e1e1e',
    borderRadius: 2, marginBottom: 28, overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #6C63FF, #a855f7)',
    borderRadius: 2,
    transition: 'width 0.4s ease',
  },
  titleBlock: { marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 800, color: '#f0f0f0', margin: 0, marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#555', margin: 0 },
  fields: { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 },
  label: { fontSize: 12, color: '#666', marginBottom: -4 },
  input: {
    background: '#1a1a1a',
    border: '1px solid #252525',
    borderRadius: 10,
    padding: '13px 14px',
    color: '#f0f0f0',
    fontSize: 14,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border 0.2s',
  },
  countryBtn: {
    background: '#1a1a1a',
    border: '1px solid #252525',
    borderRadius: 10,
    padding: '13px 14px',
    color: '#f0f0f0',
    fontSize: 14,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    fontFamily: 'inherit',
  },
  flag: { fontSize: 20 },
  countryName: { fontWeight: 600 },
  countryCode: { color: '#555', fontSize: 13 },
  dropdown: {
    background: '#161616',
    border: '1px solid #252525',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: -6,
  },
  dropdownItem: {
    width: '100%',
    background: 'none',
    border: 'none',
    borderBottom: '1px solid #1e1e1e',
    padding: '12px 14px',
    color: '#f0f0f0',
    fontSize: 14,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontFamily: 'inherit',
  },
  phoneRow: { display: 'flex', alignItems: 'stretch' },
  phoneCode: {
    background: '#1a1a1a',
    border: '1px solid #252525',
    borderLeft: 'none',
    borderRadius: '10px 0 0 10px',
    padding: '13px 12px',
    color: '#6C63FF',
    fontSize: 14,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
  },
  passRow: {
    background: '#1a1a1a',
    border: '1px solid #252525',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    paddingRight: 10,
  },
  eyeBtn: {
    background: 'none', border: 'none',
    cursor: 'pointer', padding: 6,
    display: 'flex', alignItems: 'center',
  },
  strengthBar: {
    display: 'flex', gap: 6, marginTop: -4,
  },
  strengthSeg: {
    flex: 1, height: 4, borderRadius: 2,
    transition: 'background 0.3s',
  },
  confirmSummary: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '20px 0', gap: 6,
  },
  summaryAvatar: {
    width: 70, height: 70, borderRadius: '50%',
    background: 'linear-gradient(135deg, #6C63FF, #a855f7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 28, fontWeight: 800, color: 'white',
  },
  summaryName: { fontSize: 18, fontWeight: 700, color: '#f0f0f0' },
  summaryEmail: { fontSize: 13, color: '#555' },
  nextBtn: {
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
    transition: 'opacity 0.2s',
  },
  loginLink: {
    textAlign: 'center', color: '#555', fontSize: 13, marginTop: 16, marginBottom: 0,
  },
  loginLinkText: { color: '#6C63FF', cursor: 'pointer', fontWeight: 600 },
};
