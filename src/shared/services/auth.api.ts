import { apiService } from './api.service';
import { API_ENDPOINTS } from '@shared/config';
import type { AuthResponse, User } from '@shared/types';

interface LoginPayload {
  nickname: string;
  password: string;
}

interface RegisterPayload {
  nickname: string;
  password: string;
  email?: string;
}

interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export const authAPI = {
  login: async (data: LoginPayload): Promise<AuthResponse> => {
    const response = await apiService.getClient().post(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  },

  register: async (data: RegisterPayload): Promise<AuthResponse> => {
    const response = await apiService.getClient().post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordPayload): Promise<{ message: string }> => {
    const response = await apiService.getClient().patch(API_ENDPOINTS.AUTH.PASSWORD_CHANGE, data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiService.getClient().get('/auth/me');
    return response.data;
  },
};
