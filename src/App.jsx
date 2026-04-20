import React, { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import './App.css'; // لو عندك ملف CSS

const App = () => {
  const [screen, setScreen] = useState('login');
  const [user] = useState({
    name: 'أحمد عبد السلام',
    followers: 1250,
    following: 450,
    degree: 'طالب هندسة',
    skills: 'React, UI/UX'
  });

  const navigate = (scr) => setScreen(scr);

  return (
    <div className="app dark">
      {screen === 'login' && <Login navigate={navigate} />}
      {screen === 'register' && <Register navigate={navigate} />}
      {screen === 'home' && <Home navigate={navigate} user={user} />}
      {screen === 'profile' && <Profile navigate={navigate} user={user} />}
      {screen === 'settings' && <Settings navigate={navigate} />}
    </div>
  );
};

export default App;
