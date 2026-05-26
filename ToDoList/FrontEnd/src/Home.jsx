import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TaskInput, TaskList } from './index';
import {
  getTasks,
  createTask,
  updateTaskText,
  toggleTaskCompleted,
  deleteTask,
} from './services/taskService';

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f5f5f7;
  display: flex;
  justify-content: center;
  padding: 48px 16px;
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

  &:hover {
    border-color: #dc2626;
    color: #dc2626;
  }
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

function Home({ username, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
      setError(null);
    } catch {
      setError('No se pudo conectar con el servidor. ¿Está corriendo el backend?');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (text) => {
    try {
      const newTask = await createTask(text);
      setTasks((prev) => [...prev, newTask]);
      setError(null);
    } catch {
      setError('Error al crear la tarea.');
    }
  };

  const handleToggle = async (id, completed) => {
    try {
      const updated = await toggleTaskCompleted(id, completed);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch {
      setError('Error al actualizar la tarea.');
    }
  };

  const handleEdit = async (id, text) => {
    try {
      const updated = await updateTaskText(id, text);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch {
      setError('Error al editar la tarea.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError('Error al eliminar la tarea.');
    }
  };

  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <PageWrapper>
      <Card>
        <Header>
          <Title>📝 To-Do List</Title>
          <LogoutBtn onClick={onLogout}>Cerrar sesión</LogoutBtn>
        </Header>

        <Subtitle>
          Hola, <strong>{username}</strong> —{' '}
          {pendingCount === 0
            ? '¡No tienes tareas pendientes!'
            : `Tienes ${pendingCount} tarea${pendingCount !== 1 ? 's' : ''} pendiente${pendingCount !== 1 ? 's' : ''}`}
        </Subtitle>

        {error && <ErrorBanner>{error}</ErrorBanner>}

        <TaskInput onAdd={handleAdd} />

        {loading ? (
          <LoadingMessage>Cargando tareas...</LoadingMessage>
        ) : (
          <TaskList
            tasks={tasks}
            filter={filter}
            onFilterChange={setFilter}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </Card>
    </PageWrapper>
  );
}

export default Home;