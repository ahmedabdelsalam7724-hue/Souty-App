import React from 'react';

const Profile = ({ navigate, user }) => (
  <div className="page">
    <header className="header">
      <i className="fas fa-arrow-right" onClick={() => navigate('home')}></i>
      <h3>الملف الشخصي</h3>
      <i className="fas fa-bars" onClick={() => navigate('settings')}></i>
    </header>

    <div className="profile-top">
      <img src="https://via.placeholder.com/100" className="avatar" alt="profile" />
      <div className="stats-row">
        <div className="stat"><strong>{user.followers}</strong><span>متابع</span></div>
        <div className="stat"><strong>{user.following}</strong><span>يتابع</span></div>
      </div>
    </div>

    <div className="info-box">
      <p><strong>الاسم:</strong> {user.name}</p>
      <p><strong>الدرجة العلمية:</strong> {user.degree}</p>
      <p><strong>المهارات:</strong> {user.skills}</p>
    </div>

    <button className="btn-s" style={{margin:'20px auto', display:'block', width:'90%'}} onClick={() => navigate('settings')}>تعديل البيانات</button>
  </div>
);

export default Profile;
