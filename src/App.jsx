import React, { useState, useEffect } from 'react';

// تجميعة الأيقونات (اختياري لو مفيش مكتبة، هنستخدم FontAwesome من الـ HTML)
const App = () => {
  const [screen, setScreen] = useState('login'); // التحكم في الشاشات
  const [user, setUser] = useState({ name: '', phone: '', country: '', email: '', bio: '', followers: 150, following: 85 });
  const [darkMode, setDarkMode] = useState(true);

  // دالة تغيير الشاشة
  const navigate = (screenName) => {
    setScreen(screenName);
    window.scrollTo(0, 0);
  };

  // --- مكونات الصفحات ---

  // 1. شاشة تسجيل الدخول
  const LoginScreen = () => (
    <div className="auth-screen">
      <div className="auth-card">
        <h2>تسجيل الدخول</h2>
        <input type="email" placeholder="البريد الإلكتروني" />
        <input type="password" placeholder="كلمة المرور" />
        <button className="btn-p" onClick={() => navigate('home')}>دخول</button>
        <button className="btn-o" onClick={() => navigate('reg1')}>إنشاء حساب جديد</button>
      </div>
    </div>
  );

  // 2. شاشة الملف الشخصي (Profile) - بناءً على طلبك
  const ProfileScreen = () => (
    <div className="profile-page">
      <header className="page-header">
        <i className="fas fa-arrow-right" onClick={() => navigate('home')}></i>
        <h3>الملف الشخصي</h3>
        <i className="fas fa-bars" onClick={() => alert('قائمة الإعدادات قريباً')}></i>
      </header>

      <div className="profile-info">
        <div className="profile-header">
          <img src="https://via.placeholder.com/100" alt="avatar" className="p-img" />
          <h2>{user.name || 'أحمد'}</h2>
          <p className="bio">طالب هندسة | محب للصوتيات</p>
        </div>

        <div className="stats">
          <div><strong>{user.followers}</strong><span>متابع</span></div>
          <div><strong>{user.following}</strong><span>يتابع</span></div>
          <div><strong>12</strong><span>منشور</span></div>
        </div>

        <div className="profile-details">
          <p><i className="fas fa-phone"></i> {user.phone || '0123456789'}</p>
          <p><i className="fas fa-graduation-cap"></i> الدرجة العلمية: مبرمج مبتدئ</p>
          <p><i className="fas fa-briefcase"></i> المهارات: React, Web Design</p>
        </div>

        <div className="profile-actions">
          <button className="btn-s" onClick={() => navigate('settings')}>تعديل الملف الشخصي</button>
        </div>
      </div>

      <div className="my-posts">
        <h4>منشوراتي</h4>
        <div className="mini-post">
          <p>أول منشور صوتي لي على التطبيق!</p>
          <div className="post-btns">
            <button><i className="fas fa-edit"></i></button>
            <button><i className="fas fa-trash"></i></button>
            <button><i className="fas fa-copy"></i></button>
          </div>
        </div>
      </div>
    </div>
  );

  // --- التحكم في العرض الرئيسي ---
  return (
    <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
      {screen === 'login' && <LoginScreen />}
      {screen === 'home' && (
        <div className="main-app">
          <header className="home-h">
             <span>صوتي</span>
             <i className="fas fa-user-circle" onClick={() => navigate('profile')}></i>
          </header>
          <div className="feed">
             <div className="add-p" onClick={() => alert('نافذة النشر')}>بماذا تفكر؟</div>
             <p style={{textAlign:'center', marginTop:'50px'}}>خلاصة المنشورات تظهر هنا...</p>
          </div>
          <nav className="b-nav">
             <i className="fas fa-home active"></i>
             <i className="fas fa-film"></i>
             <i className="fas fa-microphone"></i>
             <i className="fas fa-bell"></i>
          </nav>
        </div>
      )}
      {screen === 'profile' && <ProfileScreen />}

      <style>{`
        .app-container { min-height: 100vh; font-family: sans-serif; transition: 0.3s; }
        .dark { background: #0f0f0f; color: white; }
        .auth-screen { display: flex; align-items: center; justify-content: center; height: 100vh; }
        .auth-card { background: #1a1a1a; padding: 30px; border-radius: 20px; width: 85%; max-width: 400px; text-align: center; }
        input { width: 100%; padding: 12px; margin: 10px 0; border-radius: 10px; border: 1px solid #333; background: #000; color: #fff; box-sizing: border-box; }
        .btn-p { background: #6c63ff; color: white; border: none; width: 100%; padding: 12px; border-radius: 10px; cursor: pointer; font-weight: bold; }
        .btn-o { background: transparent; color: #6c63ff; border: 1px solid #6c63ff; width: 100%; padding: 12px; border-radius: 10px; margin-top: 10px; }
        
        .page-header { display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #1a1a1a; border-bottom: 1px solid #333; }
        .profile-header { text-align: center; padding: 20px; }
        .p-img { width: 90px; height: 90px; border-radius: 50%; border: 2px solid #6c63ff; }
        .stats { display: flex; justify-content: space-around; padding: 15px; border-top: 1px solid #222; border-bottom: 1px solid #222; }
        .stats div { text-align: center; display: flex; flex-direction: column; }
        .profile-details { padding: 20px; color: #aaa; font-size: 14px; }
        .btn-s { background: #333; color: white; border: none; padding: 10px 20px; border-radius: 20px; width: 90%; margin: 0 auto; display: block; }
        
        .b-nav { position: fixed; bottom: 0; width: 100%; background: #1a1a1a; display: flex; justify-content: space-around; padding: 15px 0; border-top: 1px solid #333; }
        .active { color: #6c63ff; }
        .my-posts { padding: 20px; }
        .mini-post { background: #1a1a1a; padding: 15px; border-radius: 15px; margin-top: 10px; }
        .post-btns { display: flex; gap: 15px; margin-top: 10px; color: #6c63ff; }
      `}</style>
    </div>
  );
};

export default App;
