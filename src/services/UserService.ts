import { apiClient } from '@/services/apiClient';
import type {
  UserLoginDto,
  UserLoginResponseDto,
  UserCreateDto,
  UserUpdateDto,
  GetAllUsersParams,
} from '@/models/User';

// Espejo de UserController en el backend (/api/User/*).
export const UserService = {
  login: async (data: UserLoginDto): Promise<UserLoginResponseDto> => {
    const response = await apiClient.post<UserLoginResponseDto>('/api/User/Login', data);
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
