import React, { useState } from 'react';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Register from './pages/Register';

const App = () => {
  const [screen, setScreen] = useState('login');
  const [user, setUser] = useState({
    name: 'أحمد عبد السلام',
    followers: 1250,
    following: 450,
    degree: 'طالب هندسة',
    skills: 'React'
  });

  const navigate = (scr) => setScreen(scr);

  return (
    <div className="app dark">
      {screen === 'login' && <Login navigate={navigate} />}
      {screen === 'register' && <Register navigate={navigate} />}
      {screen === 'home' && <Home navigate={navigate} user={user} />}
      {screen === 'profile' && <Profile navigate={navigate} user={user} />}
      {screen === 'settings' && <Settings navigate={navigate} />}
      
      {/* الـ CSS ممكن يفضل هنا أو تنقله لملف App.css وتعمله import */}
    </div>
  );
};

export default App;
