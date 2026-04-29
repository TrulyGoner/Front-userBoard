import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '@shared/config';
import type { RootState } from '../index';
import type { Task } from '@shared/types';

interface TasksState {
  tasks: Task[];
  currentTask: Task | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

const initialState: TasksState = {
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (params: { page?: number; pageSize?: number; status?: string | string[]; priority?: string | string[]; tag?: string; q?: string; sort?: string; order?: string; mine?: string }, { getState }) => {
    const state = getState() as RootState;

    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.order) queryParams.append('order', params.order);
    if (params.q) queryParams.append('q', params.q);
    if (params.tag) queryParams.append('tag', params.tag);
    if (params.mine) queryParams.append('mine', params.mine);

    if (params.status) {
      const statusList = Array.isArray(params.status) ? params.status : [params.status];
      statusList.forEach(s => queryParams.append('status', s));
    }

    if (params.priority) {
      const priorityList = Array.isArray(params.priority) ? params.priority : [params.priority];
      priorityList.forEach(p => queryParams.append('priority', p));
    }
    
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.TASKS.LIST}?${queryParams.toString()}`, {
      headers: { Authorization: `Bearer ${state.auth.token}` },
    });
    return response.data;
  }
);

export const fetchTask = createAsyncThunk(
  'tasks/fetchTask',
  async (id: string, { getState }) => {
    const state = getState() as RootState;
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.TASKS.DETAIL(id)}`, {
      headers: { Authorization: `Bearer ${state.auth.token}` },
    });
    return response.data;
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (task: { title: string; description?: string; status?: string; priority?: string; visibility?: string; viewerUserIds?: string[] }, { getState }) => {
    const state = getState() as RootState;
    const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.TASKS.CREATE}`, task, {
      headers: { Authorization: `Bearer ${state.auth.token}` },
    });
    return response.data;
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, task }: { id: string; task: Partial<Task> }, { getState }) => {
    const state = getState() as RootState;
    const response = await axios.put(`${API_BASE_URL}${API_ENDPOINTS.TASKS.UPDATE(id)}`, task, {
      headers: { Authorization: `Bearer ${state.auth.token}` },
    });
    return response.data;
  }
);

export const assignTask = createAsyncThunk(
  'tasks/assignTask',
  async ({ id, assigneeId }: { id: string; assigneeId: string }, { getState }) => {
    const state = getState() as RootState;
    const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.TASKS.ASSIGN(id)}`, { assigneeId }, {
      headers: { Authorization: `Bearer ${state.auth.token}` },
    });
    return response.data;
  }
);

export const approveAssignment = createAsyncThunk(
  'tasks/approveAssignment',
  async (id: string, { getState }) => {
    const state = getState() as RootState;
    const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.TASKS.APPROVE_ASSIGNMENT(id)}`, {}, {
      headers: { Authorization: `Bearer ${state.auth.token}` },
    });
    return response.data;
  }
);

export const rejectAssignment = createAsyncThunk(
  'tasks/rejectAssignment',
  async ({ id, reason }: { id: string; reason: string }, { getState }) => {
    const state = getState() as RootState;
    const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.TASKS.REJECT_ASSIGNMENT(id)}`, { comment: reason }, {
      headers: { Authorization: `Bearer ${state.auth.token}` },
    });
    return response.data;
  }
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ id, status }: { id: string; status: 'TODO' | 'IN_PROGRESS' | 'DONE' }, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    try {
      const response = await axios.patch(
        `${API_BASE_URL}${API_ENDPOINTS.TASKS.UPDATE(id)}/assignee-status`,
        { status },
        { headers: { Authorization: `Bearer ${state.auth.token}` } }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 403) {
        try {
          const taskResponse = await axios.get(
            `${API_BASE_URL}${API_ENDPOINTS.TASKS.DETAIL(id)}`,
            { headers: { Authorization: `Bearer ${state.auth.token}` } }
          );
          const task = taskResponse.data as Task & { viewers?: Array<{ id: string }> };

          const updateResponse = await axios.put(
            `${API_BASE_URL}${API_ENDPOINTS.TASKS.UPDATE(id)}`,
            {
              title: task.title,
              description: task.description || '',
              status,
              priority: task.priority,
              visibility: task.visibility,
              viewerUserIds: task.viewers?.map((v) => v.id) || []
            },
            { headers: { Authorization: `Bearer ${state.auth.token}` } }
          );
          return updateResponse.data;
        } catch (innerError) {
          const innerAxiosError = innerError as AxiosError<{ message: string }>;
          console.error('Task status update error (fallback):', innerAxiosError.response?.data || innerAxiosError.message);
          return rejectWithValue(innerAxiosError.response?.data?.message || innerAxiosError.message);
        }
      }
      
      console.error('Task status update error:', axiosError.response?.data || axiosError.message);
      return rejectWithValue(axiosError.response?.data || axiosError.message);
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.items || [];
        state.pagination = {
          page: action.payload.page || state.pagination.page,
          pageSize: action.payload.pageSize || state.pagination.pageSize,
          total: action.payload.total || 0,
        };
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      .addCase(fetchTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTask.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTask = action.payload;
      })
      .addCase(fetchTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch task';
      })
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create task';
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update task';
      })
      .addCase(assignTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignTask.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload;
        }
      })
      .addCase(assignTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to assign task';
      })
      .addCase(approveAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveAssignment.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload;
        }
      })
      .addCase(approveAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to approve assignment';
      })
      .addCase(rejectAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectAssignment.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload;
        }
      })
      .addCase(rejectAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to reject assignment';
      })
      .addCase(updateTaskStatus.pending, (state, action) => {
        state.error = null;
        // Optimistic update: immediately update task status in UI
        const taskId = action.meta.arg.id;
        const newStatus = action.meta.arg.status;
        const index = state.tasks.findIndex(task => task.id === taskId);
        if (index !== -1) {
          state.tasks[index].status = newStatus;
        }
        if (state.currentTask?.id === taskId) {
          state.currentTask.status = newStatus;
        }
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload;
        }
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update task status';
        // Revert optimistic update on error - re-fetch tasks from API
        // This will be handled by component-level error handling or user retry
      });
  },
});

export const { clearError } = tasksSlice.actions;
export default tasksSlice.reducer;