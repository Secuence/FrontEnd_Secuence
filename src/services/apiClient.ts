import axios from 'axios';
import { env } from '@/config/env';
import { getToken, logout } from '@/state/authStore';

// Capa única de llamadas HTTP. Ningún script del sitio debe usar
// fetch/axios directamente: siempre pasa por este cliente centralizado.
//
// En dev (`npm run dev`) usamos ruta relativa para pasar por el proxy de
// Vite (ver vite.config.ts) — el backend real todavía no tiene CORS
// habilitado para llamadas desde el navegador. En build de producción se
// llama directo a VITE_API_BASE_URL: eso SÍ requiere que el backend
// permita el origen real del frontend por CORS antes de desplegar.
export const apiClient = axios.create({
  baseURL: import.meta.env.DEV ? '' : env.apiBaseUrl,
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
