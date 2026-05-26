import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TaskInput, TaskItem, FilterBar } from './components';
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

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px;
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

const TaskList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #bbb;
  font-size: 15px;
  padding: 40px 0;
`;

function Home() {
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

  const filteredTasks = filter === 'pending'
    ? tasks.filter((t) => !t.completed)
    : tasks;

  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <PageWrapper>
      <Card>
        <Title>📝 To-Do List</Title>
        <Subtitle>
          {pendingCount === 0
            ? '¡Todo listo! No tienes tareas pendientes.'
            : `Tienes ${pendingCount} tarea${pendingCount !== 1 ? 's' : ''} pendiente${pendingCount !== 1 ? 's' : ''}`}
        </Subtitle>

        {error && <ErrorBanner>{error}</ErrorBanner>}

        <TaskInput onAdd={handleAdd} />

        <FilterBar filter={filter} onFilterChange={setFilter} />

        {loading ? (
          <LoadingMessage>Cargando tareas...</LoadingMessage>
        ) : filteredTasks.length === 0 ? (
          <EmptyMessage>
            {filter === 'pending'
              ? '¡No hay tareas pendientes!'
              : 'Agrega tu primera tarea arriba.'}
          </EmptyMessage>
        ) : (
          <TaskList>
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </TaskList>
        )}
      </Card>
    </PageWrapper>
  );
}

export default Home;