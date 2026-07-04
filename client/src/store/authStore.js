import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/client.js';

export const useAuthStore = create(persist((set, get) => ({
  user: null,
  token: null,
  loading: false,
  login: async (credentials) => {
    set({ loading: true });
    try { const { data } = await api.post('/auth/login', credentials); set({ ...data, loading: false }); return data; }
    catch (error) { set({ loading: false }); throw error; }
  },
  register: async (details) => {
    set({ loading: true });
    try { const { data } = await api.post('/auth/register', details); set({ ...data, loading: false }); return data; }
    catch (error) { set({ loading: false }); throw error; }
  },
  logout: () => set({ user: null, token: null }),
  isSaved: (id) => get().user?.savedEvents?.some((item) => (item._id || item).toString() === id) || false,
  toggleSaved: async (id) => {
    const { data } = await api.patch(`/users/saved/${id}`);
    const current = get().user.savedEvents || [];
    set({ user: { ...get().user, savedEvents: data.saved ? [...current, id] : current.filter((item) => (item._id || item).toString() !== id) } });
    return data.saved;
  }
}), { name: 'evently-auth', partialize: ({ user, token }) => ({ user, token }) }));
