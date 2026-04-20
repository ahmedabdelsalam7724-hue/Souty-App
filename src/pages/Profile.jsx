import React from 'react';

const Profile = ({ user, navigate }) => (
  <div className="page">
    <header className="header">
      <i className="fas fa-arrow-right" onClick={() => navigate('home')}></i>
      <h3>{user.name}</h3>
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
      <p><i className="fas fa-graduation-cap"></i> الدرجة: {user.degree}</p>
      <p><i className="fas fa-tools"></i> المهارات: {user.skills}</p>
    </div>
  </div>
);

export default Profile;
