import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import {
  loginPending,
  loginSuccess,
  loginError,
  logout as logoutAction,
} from '@/store/slices/auth/authSlice';
import { login as loginService } from '@/services/auth/login';
import type { UseAuthReturn } from './useAuth.d';

export function useAuth(): UseAuthReturn {
  const dispatch = useAppDispatch();
  const { user, token, expiresAt, status, error } = useAppSelector((s) => s.auth);

  const login = useCallback(
    async (username: string, password: string) => {
      dispatch(loginPending());
      try {
        const session = await loginService({ username, password });
        dispatch(loginSuccess(session));
      } catch (e) {
        dispatch(loginError(e instanceof Error ? e.message : 'Login failed'));
        throw e;
      }
    },
    [dispatch],
  );

  const logout = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  const isAuthenticated = Boolean(user && token && (!expiresAt || expiresAt > Date.now()));

  return {
    user,
    role: user?.role ?? 'guest',
    isAuthenticated,
    login,
    logout,
    loading: status === 'loading',
    error,
  };
}

export default useAuth;
