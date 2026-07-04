import axios from 'axios';
import { env } from '@/config/env';
import { useAuth } from '@/hooks/useAuth';

// Capa única de llamadas HTTP. Ningún componente o feature debe usar
// fetch/axios directamente: siempre pasa por este cliente centralizado.
export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const { token } = useAuth.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuth.getState().logout();
    }
    return Promise.reject(error);
  },
);
