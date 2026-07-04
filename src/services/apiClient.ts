import axios from 'axios';
import { env } from '@/config/env';
import { getToken, logout } from '@/state/authStore';

// Capa única de llamadas HTTP. Ningún script del sitio debe usar
// fetch/axios directamente: siempre pasa por este cliente centralizado.
export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logout();
    }
    return Promise.reject(error);
  },
);
