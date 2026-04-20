import React from 'react';

const Home = ({ navigate, user }) => (
  <div className="main-app">
    <header className="header">
      <i className="fas fa-search"></i>
      <h3>صوتي</h3>
      <i className="fas fa-user-circle" onClick={() => navigate('profile')}></i>
    </header>

    <div className="feed-content">
      <div className="add-post-bar" onClick={() => alert('قريباً: إضافة منشور')}>
        بماذا تفكر يا {user.name.split(' ')[0]}؟
      </div>
      <div className="post-card-dummy">
        <p>مرحباً بك في React! ابدأ بنشر أول ملف صوتي لك.</p>
      </div>
    </div>

    <nav className="bottom-nav">
      <i className="fas fa-home active"></i>
      <i className="fas fa-film"></i>
      <i className="fas fa-microphone"></i>
      <i className="fas fa-bell"></i>
    </nav>
  </div>
);

export default Home;
