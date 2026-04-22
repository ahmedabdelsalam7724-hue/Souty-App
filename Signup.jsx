import { useState } from 'react';

export default function Signup() {
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const [msg, setMsg] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setMsg('جاري الحفظ في قاعدة البيانات... ⏳');

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      setMsg('تم إنشاء الحساب بنجاح! 🎉');
      // السيرفر هنا هيكون زرع الـ Cookie خلاص، فالمستخدم بقى Login
      setTimeout(() => window.location.href = '/home', 1500);
    } else {
      setMsg(`خطأ: ${data.error}`);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleSignup} style={{ background: '#1e293b', padding: '30px', borderRadius: '15px', width: '300px' }}>
        <h2 style={{ color: '#38bdf8', textAlign: 'center' }}>إنشاء حساب جديد</h2>
        <input 
          type="text" placeholder="اسم المستخدم" required 
          onChange={e => setFormData({...formData, username: e.target.value})} 
          style={inputStyle} 
        />
        <input 
          type="email" placeholder="البريد الإلكتروني" required 
          onChange={e => setFormData({...formData, email: e.target.value})} 
          style={inputStyle} 
        />
        <input 
          type="password" placeholder="كلمة السر" required 
          onChange={e => setFormData({...formData, password: e.target.value})} 
          style={inputStyle} 
        />
        <button type="submit" style={btnStyle}>تسجيل وحفظ 🚀</button>
        <p style={{ color: '#94a3b8', textAlign: 'center', fontSize: '14px' }}>{msg}</p>
      </form>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: 'none', background: '#334155', color: 'white' };
const btnStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: 'none', background: '#38bdf8', color: 'white', fontWeight: 'bold', cursor: 'pointer' };
