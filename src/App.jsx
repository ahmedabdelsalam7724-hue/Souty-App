import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Rooms from './pages/Rooms';
import Messages from './pages/Messages';
import './App.css';

const App = () => {
  const [screen, setScreen] = useState('login');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('souty_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setScreen('home');
    }
  }, []);

  const navigate = (scr) => setScreen(scr);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('souty_user', JSON.stringify(userData));
    setScreen('home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('souty_user');
    setScreen('login');
  };

  return (
    <div className="app dark">
      {screen === 'login'    && <Login    navigate={navigate} onLogin={handleLogin} />}
      {screen === 'register' && <Register navigate={navigate} onLogin={handleLogin} />}
      {screen === 'home'     && <Home     navigate={navigate} user={user} />}
      {screen === 'profile'  && <Profile  navigate={navigate} user={user} />}
      {screen === 'settings' && <Settings navigate={navigate} onLogout={handleLogout} />}
      {screen === 'rooms'    && <Rooms    navigate={navigate} user={user} />}
      {screen === 'messages' && <Messages navigate={navigate} user={user} />}
    </div>
  );
};

export default App;
