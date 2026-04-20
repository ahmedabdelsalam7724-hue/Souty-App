import React from 'react';

const Settings = ({ navigate }) => (
  <div className="page">
    <header className="header">
      <i className="fas fa-arrow-right" onClick={() => navigate('profile')}></i>
      <h3>الإعدادات</h3>
      <div></div>
    </header>

    <div className="settings-list">
      <div className="s-item">تغيير اللغة</div>
      <div className="s-item">خصوصية الحساب</div>
      <div className="s-item" style={{color:'red'}} onClick={() => navigate('login')}>تسجيل الخروج</div>
    </div>
  </div>
);

export default Settings;
