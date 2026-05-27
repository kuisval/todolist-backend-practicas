import { useEffect } from 'react';
import Home from './Home';
import { Login } from './components/Login';
import useAuthStore from './store/useAuthStore';

function App() {
  const { username, loginWithGoogle } = useAuthStore();

  // Leer token de Google desde la URL
  useEffect(() => {
    const params   = new URLSearchParams(window.location.search);
    const token    = params.get('token');
    const user     = params.get('username');
    if (token && user) {
      loginWithGoogle(token, user);
      window.history.replaceState({}, '', '/');
    }
  }, []);

  if (!username) return <Login />;
  return <Home />;
}

export default App;