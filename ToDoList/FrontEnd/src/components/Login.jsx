import { useState } from 'react';
import styled from 'styled-components';
import { GoogleLogin } from '@react-oauth/google';
import useAuthStore from '../store/useAuthStore';

const Wrapper = styled.div`
  min-height: 100vh;
  /* Gradiente ultra suave que emula la calma del cielo matutino */
  background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 24px; /* Esquinas más suaves */
  padding: 40px;
  width: 100%;
  max-width: 400px;
  /* Sombra profunda pero muy difuminada para que se vea ligero */
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.06);
  border: 1px solid rgba(226, 232, 240, 0.8);
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 600; /* Reducido de 700 a 600 para mayor elegancia */
  color: #1e293b; /* Slate oscuro */
  margin: 0 0 8px;
  text-align: center;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  color: #64748b; /* Gris azulado suave */
  font-size: 14px;
  text-align: center;
  margin: 0 0 32px;
`;

const Field = styled.div`
  margin-bottom: 18px;
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  margin-bottom: 6px;
  padding-left: 2px; /* Alineación ligera */
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0; /* Borde ultra fino */
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  color: #1e293b;
  background-color: #f8fafc;
  outline: none;
  box-sizing: border-box;
  transition: all 0.25s ease-in-out;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    border-color: #0284c7;
    background-color: #ffffff;
    box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.12); /* Sutil aura azul */
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #1e40af; /* Azul marino profundo corporativo y elegante */
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 12px;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #1d4ed8;
    box-shadow: 0 4px 12px rgba(30, 64, 175, 0.2);
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    background-color: #93c5fd;
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const Toggle = styled.p`
  text-align: center;
  font-size: 13px;
  color: #64748b;
  margin-top: 24px;

  span {
    color: #0284c7; /* Azul link limpio */
    font-weight: 500;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: #0369a1;
      text-decoration: underline;
    }
  }
`;

const ErrorMsg = styled.p`
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fee2e2;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 13px;
  margin-bottom: 20px;
  font-weight: 500;
`;

const Divider = styled.p`
  text-align: center;
  color: #94a3b8;
  font-size: 12px;
  margin: 24px 0 20px;
  position: relative;

  &::before, &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 40%;
    height: 1px;
    background: #e2e8f0;
  }
  &::before { left: 0; }
  &::after  { right: 0; }
`;

export function Login() {
  const { login, register } = useAuthStore();
  const [isLogin, setIsLogin]   = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Completa todos los campos');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      isLogin
        ? await login(username, password)
        : await register(username, password);
    } catch (err) {
      setError(err.message);
    } finally {
      loading && setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    window.location.href = 'http://localhost:3001/auth/google';
  }; 

  return (
    <Wrapper>
      <Card>
        <Title>📋 To-Do List</Title>
        <Subtitle>{isLogin ? 'Inicia sesión para organizar tu día' : 'Crea tu cuenta y empieza hoy'}</Subtitle>

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
          {loading ? 'Conectando...' : isLogin ? 'Ingresar' : 'Crear cuenta'}
        </Button>

        <Divider>o continúa con</Divider>
        
        {/* Contenedor sutil para centrar el botón nativo de Google */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Error al iniciar sesión con Google')}
            theme="outline"
            shape="rectangular"
          />
        </div>

        <Toggle>
          {isLogin ? '¿Nuevo por aquí? ' : '¿Ya tienes una cuenta? '}
          <span onClick={() => { setIsLogin(!isLogin); setError(null); }}>
            {isLogin ? 'Regístrate' : 'Inicia sesión'}
          </span>
        </Toggle>
      </Card>
    </Wrapper>
  );
}

export default Login;