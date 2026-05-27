import { useState, useEffect } from 'react';
import Home from './Home';
import { Login } from './components/Login';

function App() {
  const [username, setUsername] = useState(
    localStorage.getItem('username') || null
  );

  // Leer token de Google desde la URL (?token=...&username=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token    = params.get('token');
    const user     = params.get('username');

    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('username', user);
      setUsername(user);
      // Limpiar la URL
      window.history.replaceState({}, '', '/');
    }
  }, []);

  const handleAuth = (user) => setUsername(user);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername(null);
  };

  if (!username) return <Login onAuth={handleAuth} />;
  return <Home username={username} onLogout={handleLogout} />;
}

export default App;