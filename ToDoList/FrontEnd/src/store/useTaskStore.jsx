import { create } from 'zustand';
import {
  getTasks,
  createTask,
  updateTaskText,
  toggleTaskCompleted,
  deleteTask,
  updateDueDate,
} from '../services/taskService';

const useTaskStore = create((set) => ({
  tasks:   [],
  filter:  'all',
  loading: false,
  error:   null,

  setFilter: (filter) => set({ filter }),

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getTasks();
      set({ tasks: data });
    } catch {
      set({ error: 'No se pudo conectar con el servidor. ¿Está corriendo el backend?' });
    } finally {
      set({ loading: false });
    }
  },

  setDueDate: async (id, due_date) => {
  try {
    const updated = await updateDueDate(id, due_date);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
    }));
  } catch {
    set({ error: 'Error al actualizar la fecha.' });
  }
  },

  addTask: async (text) => {
    try {
      const newTask = await createTask(text);
      set((state) => ({ tasks: [...state.tasks, newTask], error: null }));
    } catch {
      set({ error: 'Error al crear la tarea.' });
    }
  },

  toggleTask: async (id, completed) => {
    try {
      const updated = await toggleTaskCompleted(id, completed);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
      }));
    } catch {
      set({ error: 'Error al actualizar la tarea.' });
    }
  },

  editTask: async (id, text) => {
    try {
      const updated = await updateTaskText(id, text);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
      }));
    } catch {
      set({ error: 'Error al editar la tarea.' });
    }
  },

  deleteTask: async (id) => {
    try {
      await deleteTask(id);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }));
    } catch {
      set({ error: 'Error al eliminar la tarea.' });
    }
  },
}));

export default useTaskStore;