import React from 'react';

const Login = ({ navigate }) => (
  <div className="auth-screen">
    <div className="auth-card">
      <h2>تسجيل الدخول</h2>
      <input type="email" placeholder="البريد الإلكتروني" />
      <input type="password" placeholder="كلمة المرور" />
      <button className="btn-p" onClick={() => navigate('home')}>دخول</button>
      <button className="btn-o" onClick={() => navigate('register')}>إنشاء حساب جديد</button>
    </div>
  </div>
);

export default Login;
