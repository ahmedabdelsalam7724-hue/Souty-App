import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import './App.css';

const App = () => {
  const [screen, setScreen] = useState('login');
  const [user, setUser] = useState(null);

  // لو المستخدم كان مسجل دخول قبل كده، نروحه الهوم مباشرة
  useEffect(() => {
    const savedUser = localStorage.getItem('souty_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setScreen('home');
    }
  }, []);

  const navigate = (scr) => setScreen(scr);

  // لما المستخدم يسجل دخول أو يعمل حساب
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('souty_user', JSON.stringify(userData));
    setScreen('home');
  };

  // لما المستخدم يسجل خروج
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('souty_user');
    setScreen('login');
  };

  return (
    <div className="app dark">
      {screen === 'login' && (
        <Login navigate={navigate} onLogin={handleLogin} />
      )}
      {screen === 'register' && (
        <Register navigate={navigate} onLogin={handleLogin} />
      )}
      {screen === 'home' && (
        <Home navigate={navigate} user={user} />
      )}
      {screen === 'profile' && (
        <Profile navigate={navigate} user={user} />
      )}
      {screen === 'settings' && (
        <Settings navigate={navigate} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
