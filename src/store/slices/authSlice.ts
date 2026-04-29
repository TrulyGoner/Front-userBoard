import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI, apiService } from '@shared/services';
import type { AuthState } from '@shared/types';

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
    return data;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ nickname, password, email }: { nickname: string; password: string; email?: string }) => {
    const data = await authAPI.register({ nickname, password, email });
    apiService.setToken(data.accessToken);
    return data;
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
;
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;