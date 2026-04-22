import { useState } from 'react';

export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    bio: 'مستخدم صوتي جديد 🎙️' // حقل إضافي كدا كبداية
  });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('جاري إنشاء الحساب... ⏳');

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus('تم إنشاء الحساب بنجاح! 🎉 يمكنك الآن تسجيل الدخول.');
      // هنا ممكن تنقل المستخدم لصفحة الرفع أو البروفايل
    } else {
      setStatus(`خطأ: ${data.error}`);
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={{ color: '#38bdf8' }}>إنشاء حساب "صوتي"</h2>
        
        <input 
          type="text" 
          placeholder="اسم المستخدم (Username)" 
          required 
          onChange={(e) => setFormData({...formData, username: e.target.value})} 
          style={inputStyle}
        />
        
        <input 
          type="email" 
          placeholder="البريد الإلكتروني" 
          required 
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
          style={inputStyle}
        />
        
        <input 
          type="password" 
          placeholder="كلمة السر" 
          required 
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>تسجيل الحساب 🚀</button>
        
        {status && <p style={{ marginTop: '15px', color: '#94a3b8' }}>{status}</p>}
      </form>
    </div>
  );
}

// ستايلات سريعة للمظهر
const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0f172a' };
const formStyle = { backgroundColor: '#1e293b', padding: '30px', borderRadius: '15px', textAlign: 'center', width: '300px' };
const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '8px', border: 'none', background: '#334155', color: 'white' };
const buttonStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#38bdf8', color: 'white', fontWeight: 'bold', cursor: 'pointer' };
