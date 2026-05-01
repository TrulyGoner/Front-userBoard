import { apiService } from './api.service';
import { API_ENDPOINTS } from '@shared/config';
import type { Task } from '@shared/types';

interface CreateTaskPayload {
  title: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  visibility?: 'ONLY_ME' | 'LIST' | 'ANYONE';
}

export type UpdateTaskPayload = Partial<CreateTaskPayload>;

export interface TaskFiltersPayload {
  status?: string;
  priority?: string;
  assigneeId?: string;
  creatorId?: string;
  search?: string;
  tags?: string[];
}

export const tasksAPI = {
  getList: async (filters?: TaskFiltersPayload): Promise<Task[]> => {
    const response = await apiService.getClient().get(API_ENDPOINTS.TASKS.LIST, {
      params: filters,
    });
    return response.data;
  },

  getDetail: async (id: string): Promise<Task> => {
    const response = await apiService.getClient().get(API_ENDPOINTS.TASKS.DETAIL(id));
    return response.data;
  },

  create: async (data: CreateTaskPayload): Promise<Task> => {
    const response = await apiService.getClient().post(API_ENDPOINTS.TASKS.CREATE, data);
    return response.data;
  },

  update: async (id: string, data: UpdateTaskPayload): Promise<Task> => {
    const response = await apiService.getClient().patch(
      API_ENDPOINTS.TASKS.UPDATE(id),
      data
    );
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiService.getClient().delete(API_ENDPOINTS.TASKS.DELETE(id));
    return response.data;
  },

  assign: async (id: string, assigneeId: string): Promise<Task> => {
    const response = await apiService.getClient().post(
      API_ENDPOINTS.TASKS.ASSIGN(id),
      { assigneeId }
    );
    return response.data;
  },

  approveAssignment: async (id: string): Promise<Task> => {
    const response = await apiService.getClient().post(API_ENDPOINTS.TASKS.APPROVE_ASSIGNMENT(id));
    return response.data;
  },

  rejectAssignment: async (id: string): Promise<Task> => {
    const response = await apiService.getClient().post(API_ENDPOINTS.TASKS.REJECT_ASSIGNMENT(id));
    return response.data;
  },

  addTag: async (id: string, tagId: string): Promise<Task> => {
    const response = await apiService.getClient().post(
      API_ENDPOINTS.TASKS.ADD_TAG(id),
      { tagId }
    );
    return response.data;
  },

  removeTag: async (taskId: string, tagId: string): Promise<Task> => {
    const response = await apiService.getClient().delete(
      API_ENDPOINTS.TASKS.REMOVE_TAG(taskId, tagId)
    );
    return response.data;
  },
};
