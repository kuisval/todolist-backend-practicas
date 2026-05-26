import { useState } from 'react';
import styled from 'styled-components';
import { login, register } from '../services/taskService';

const Wrapper = styled.div`
  min-height: 100vh;
  background-color: #f5f5f7;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #888;
  font-size: 14px;
  text-align: center;
  margin: 0 0 32px;
`;

const Field = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #444;
  margin-bottom: 6px;
`;

const Input = styled.input`
  width: 100%;
  padding: 11px 14px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 15px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;

  &:focus {
    border-color: #4f46e5;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 13px;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4338ca;
  }

  &:disabled {
    background-color: #a5b4fc;
    cursor: not-allowed;
  }
`;

const Toggle = styled.p`
  text-align: center;
  font-size: 14px;
  color: #888;
  margin-top: 20px;

  span {
    color: #4f46e5;
    font-weight: 600;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMsg = styled.p`
  background: #fee2e2;
  color: #dc2626;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 16px;
`;

function Login({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Completa todos los campos');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = isLogin
        ? await login(username, password)
        : await register(username, password);

      // Guardar token y username en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);

      onAuth(data.username); // avisar a App que ya está autenticado
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <Wrapper>
      <Card>
        <Title>📝 To-Do List</Title>
        <Subtitle>{isLogin ? 'Inicia sesión para ver tus tareas' : 'Crea tu cuenta'}</Subtitle>

        {error && <ErrorMsg>{error}</ErrorMsg>}

        <Field>
          <Label>Usuario</Label>
          <Input
            type="text"
            placeholder="Tu nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </Field>

        <Field>
          <Label>Contraseña</Label>
          <Input
            type="password"
            placeholder="Tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </Field>

        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Cargando...' : isLogin ? 'Iniciar sesión' : 'Registrarse'}
        </Button>

        <Toggle>
          {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          <span onClick={() => { setIsLogin(!isLogin); setError(null); }}>
            {isLogin ? 'Regístrate' : 'Inicia sesión'}
          </span>
        </Toggle>
      </Card>
    </Wrapper>
  );
}

export default Login;
