import axios from 'axios';
import { env } from '@/config/env';

// Cliente HTTP para la plataforma externa (pacientes/historias + médicos).
// Separado de src/services/apiClient.ts (backend propio de Secuence) a
// propósito: son dos proveedores de datos distintos.
//
// TODO(contrato pendiente): no existe todavía la API real, así que no se
// sabe su esquema de autenticación (¿API key? ¿JWT propio? ¿OAuth?). No
// asumir Bearer aquí — confirmar con el proveedor cuando llegue el contrato
// y agregar el interceptor de auth que corresponda.
export const externalApiClient = axios.create({
  baseURL: env.externalApiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
});
