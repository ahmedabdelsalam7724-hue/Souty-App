import { useState } from 'react';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [msg, setMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg('جاري التحقق من البيانات... 🔑');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      setMsg('أهلاً بعودتك! 🎉 جاري التحويل...');
      setTimeout(() => window.location.href = '/home', 1500);
    } else {
      setMsg(`خطأ: ${data.error}`);
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleLogin} style={formStyle}>
        <h2 style={{ color: '#38bdf8', textAlign: 'center' }}>تسجيل الدخول</h2>
        <input 
          type="text" placeholder="اسم المستخدم" required 
          onChange={e => setFormData({...formData, username: e.target.value})} 
          style={inputStyle} 
        />
        <input 
          type="password" placeholder="كلمة السر" required 
          onChange={e => setFormData({...formData, password: e.target.value})} 
          style={inputStyle} 
        />
        <button type="submit" style={btnStyle}>دخول 🚀</button>
        <p style={{ color: '#94a3b8', textAlign: 'center', fontSize: '14px' }}>{msg}</p>
        <a href="/signup" style={{ color: '#38bdf8', fontSize: '12px', textDecoration: 'none' }}>ليس لديك حساب؟ سجل الآن</a>
      </form>
    </div>
  );
}

// الستايلات (نفس ستايلات Signup لتوحيد الشكل)
const containerStyle = { display: 'flex', justifyContent: 'center', marginTop: '50px', fontFamily: 'sans-serif' };
const formStyle = { background: '#1e293b', padding: '30px', borderRadius: '15px', width: '300px', textAlign: 'center' };
const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: 'none', background: '#334155', color: 'white' };
const btnStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: 'none', background: '#38bdf8', color: 'white', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' };
