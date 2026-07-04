import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('evently-auth');
  if (stored) {
    const token = JSON.parse(stored)?.state?.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getError = (error) => error.response?.data?.message || error.message || 'Something went wrong';
export default api;
