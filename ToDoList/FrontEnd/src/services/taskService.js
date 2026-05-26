// Todas las llamadas al backend centralizadas aquí
const BASE_URL = 'http://localhost:3001';

// Obtener todas las tareas
export const getTasks = async () => {
  const response = await fetch(`${BASE_URL}/tasks`);
  if (!response.ok) throw new Error('Error al obtener las tareas');
  return response.json();
};

// Crear una nueva tarea
export const createTask = async (text) => {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) throw new Error('Error al crear la tarea');
  return response.json();
};

// Actualizar el texto de una tarea
export const updateTaskText = async (id, text) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) throw new Error('Error al actualizar la tarea');
  return response.json();
};

// Marcar/desmarcar una tarea como completada
export const toggleTaskCompleted = async (id, completed) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  });
  if (!response.ok) throw new Error('Error al actualizar el estado');
  return response.json();
};

// Eliminar una tarea
export const deleteTask = async (id) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Error al eliminar la tarea');
  return response.json();
};
