import { useEffect } from 'react';
import styled from 'styled-components';
import { TaskInput, TaskList, CalendarPanel } from './index';
import useAuthStore from './store/useAuthStore';
import useTaskStore from './store/useTaskStore';

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f5f5f7;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 48px 16px;
  gap: 24px;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 640px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  height: fit-content;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

const LogoutBtn = styled.button`
  padding: 7px 16px;
  background: transparent;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 13px;
  color: #888;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { border-color: #dc2626; color: #dc2626; }
`;

const Subtitle = styled.p`
  color: #888;
  margin: 0 0 32px;
  font-size: 14px;
`;

const ErrorBanner = styled.div`
  background: #fee2e2;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  margin-bottom: 20px;
`;

const LoadingMessage = styled.p`
  text-align: center;
  color: #bbb;
  font-size: 15px;
  padding: 40px 0;
`;

function Home() {
  const { username, logout }           = useAuthStore();
  const { fetchTasks, loading, error } = useTaskStore();
  const pendingCount = useTaskStore(
    (state) => state.tasks.filter((t) => !t.completed).length
  );

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <PageWrapper>
      <Card>
        <Header>
          <Title>To-Do List</Title>
          <LogoutBtn onClick={logout}>Cerrar sesión</LogoutBtn>
        </Header>

        <Subtitle>
          Hola, <strong>{username}</strong> —{' '}
          {pendingCount === 0
            ? '¡No tienes tareas pendientes!'
            : `Tienes ${pendingCount} tarea${pendingCount !== 1 ? 's' : ''} pendiente${pendingCount !== 1 ? 's' : ''}`}
        </Subtitle>

        {error && <ErrorBanner>{error}</ErrorBanner>}

        <TaskInput />

        {loading ? (
          <LoadingMessage>Cargando tareas...</LoadingMessage>
        ) : (
          <TaskList />
        )}
      </Card>

      <CalendarPanel />
    </PageWrapper>
  );
}

export default Home;