import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, AuthSession } from './authSlice.d';

const initialState: AuthState = {
  user: null,
  token: null,
  expiresAt: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginPending(state) {
      state.status = 'loading';
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<AuthSession>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.expiresAt = action.payload.expiresAt;
      state.status = 'idle';
      state.error = null;
    },
    loginError(state, action: PayloadAction<string>) {
      state.status = 'error';
      state.error = action.payload;
    },
    logout() {
      return initialState;
    },
  },
});

export const { loginPending, loginSuccess, loginError, logout } = authSlice.actions;
export default authSlice.reducer;
