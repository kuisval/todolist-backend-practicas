import { useState } from 'react';
import Home from './Home';
import Login from './components/Login';

function App() {
  // Verificar si ya hay sesión guardada
  const [username, setUsername] = useState(
    localStorage.getItem('username') || null
  );

  const handleAuth = (user) => {
    setUsername(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername(null);
  };

  if (!username) {
    return <Login onAuth={handleAuth} />;
  }

  return <Home username={username} onLogout={handleLogout} />;
}

export default App;
