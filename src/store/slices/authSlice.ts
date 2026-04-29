import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI, apiService } from '@shared/services';
import type { AuthState } from '@shared/types';

const STORAGE_KEY = 'auth_session';

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ nickname, password }: { nickname: string; password: string }) => {
    const data = await authAPI.login({ nickname, password });
    apiService.setToken(data.accessToken);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      token: data.accessToken,
      user: data.user,
    }));
    return data;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ nickname, password, email }: { nickname: string; password: string; email?: string }) => {
    const data = await authAPI.register({ nickname, password, email });
    apiService.setToken(data.accessToken);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      token: data.accessToken,
      user: data.user,
    }));
    return data;
  }
);

export const restoreAuthFromStorage = createAsyncThunk(
  'auth/restoreFromStorage',
  async () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return null;
      }
      const { token, user } = JSON.parse(stored);
      // Set token in API service for subsequent requests
      apiService.setToken(token);
      return { accessToken: token, user };
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem(STORAGE_KEY);
      apiService.clearToken();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(restoreAuthFromStorage.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.accessToken;
        }
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;