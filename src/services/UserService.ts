import { apiClient } from '@/services/apiClient';
import type {
  UserLoginDto,
  ApiEnvelope,
  UserCreateDto,
  UserUpdateDto,
  GetAllUsersParams,
} from '@/models/User';

// Espejo de UserController en el backend (/api/User/*).
export const UserService = {
  // El backend envuelve toda respuesta en { ok, data, message, id } y usa
  // status HTTP no estándar para errores de negocio (ej. login inválido =
  // 404, no 401) — por eso devolvemos el sobre completo sin desenvolver, y
  // dejamos que quien llama decida con `ok`, no con el status HTTP.
  login: async (data: UserLoginDto): Promise<ApiEnvelope> => {
    const response = await apiClient.post<ApiEnvelope>('/api/User/Login', data);
    return response.data;
  },

  createUser: async (data: UserCreateDto) => {
    const response = await apiClient.post('/api/User/CreateUser', data);
    return response.data;
  },

  getAllUsers: async (params: GetAllUsersParams) => {
    const response = await apiClient.get('/api/User/GetAllUsers', { params });
    return response.data;
  },

  updateUser: async (id: number, data: UserUpdateDto) => {
    const response = await apiClient.put(`/api/User/UpdateUser/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: number) => {
    const response = await apiClient.delete(`/api/User/DeleteUser/${id}`);
    return response.data;
  },
};
