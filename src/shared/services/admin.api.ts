import axios, { AxiosError } from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '@shared/config';
import type { User } from '@shared/types';

interface ErrorResponse {
  message: string;
}

export interface UserWithBanned extends User {
  bannedAt?: string | null;
}

class AdminApiService {
  private getAuthHeaders(token: string) {
    return { Authorization: `Bearer ${token}` };
  }

  async fetchUsers(token: string): Promise<UserWithBanned[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.ADMIN.USERS_LIST}`, {
        headers: this.getAuthHeaders(token),
      });
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      throw new Error(axiosError.response?.data?.message || 'Failed to load users');
    }
  }

  async banUser(userId: string, token: string): Promise<void> {
    try {
      await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.ADMIN.BAN_USER(userId)}`,
        {},
        { headers: this.getAuthHeaders(token) }
      );
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      throw new Error(axiosError.response?.data?.message || 'Failed to ban user');
    }
  }

  async unbanUser(userId: string, token: string): Promise<void> {
    try {
      await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.ADMIN.UNBAN_USER(userId)}`,
        {},
        { headers: this.getAuthHeaders(token) }
      );
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      throw new Error(axiosError.response?.data?.message || 'Failed to unban user');
    }
  }

  async grantAdminRole(userId: string, token: string): Promise<void> {
    try {
      await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.ADMIN.GRANT_ADMIN(userId)}`,
        {},
        { headers: this.getAuthHeaders(token) }
      );
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      throw new Error(axiosError.response?.data?.message || 'Failed to grant admin role');
    }
  }

  async revokeAdminRole(userId: string, token: string): Promise<void> {
    try {
      await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.ADMIN.REVOKE_ADMIN(userId)}`,
        {},
        { headers: this.getAuthHeaders(token) }
      );
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      throw new Error(axiosError.response?.data?.message || 'Failed to revoke admin role');
    }
  }
}

export const adminApiService = new AdminApiService();
