const BASE_URL = 'http://localhost:3001';

// Obtener el token guardado en localStorage
const getToken = () => localStorage.getItem('token');

// Headers con autorización
const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
});

// ─── Auth ───────────────────────────────

export const register = async (username, password) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error);
  }
  return response.json(); // { token, username }
};

export const login = async (username, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error);
  }
  return response.json(); // { token, username }
};

// ─── Tasks ──────────────────────────────

export const getTasks = async () => {
  const response = await fetch(`${BASE_URL}/tasks`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error('Error al obtener las tareas');
  return response.json();
};

export const createTask = async (text) => {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ text }),
  });
  if (!response.ok) throw new Error('Error al crear la tarea');
  return response.json();
};

export const updateTaskText = async (id, text) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ text }),
  });
  if (!response.ok) throw new Error('Error al actualizar la tarea');
  return response.json();
};

export const toggleTaskCompleted = async (id, completed) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ completed }),
  });
  if (!response.ok) throw new Error('Error al actualizar el estado');
  return response.json();
};

export const deleteTask = async (id) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error('Error al eliminar la tarea');
  return response.json();
};
