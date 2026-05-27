import { create } from 'zustand';
import { login as loginService, register as registerService } from '../services/taskService';

const useAuthStore = create((set) => ({
  username: localStorage.getItem('username') || null,
  token:    localStorage.getItem('token')    || null,

  login: async (username, password) => {
    const data = await loginService(username, password);
    localStorage.setItem('token',    data.token);
    localStorage.setItem('username', data.username);
    set({ token: data.token, username: data.username });
  },

  loginWithGoogle: (token, username) => {
    localStorage.setItem('token',    token);
    localStorage.setItem('username', username);
    set({ token, username });
  },

  register: async (username, password) => {
    const data = await registerService(username, password);
    localStorage.setItem('token',    data.token);
    localStorage.setItem('username', data.username);
    set({ token: data.token, username: data.username });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    set({ token: null, username: null });
  },
}));

export default useAuthStore;