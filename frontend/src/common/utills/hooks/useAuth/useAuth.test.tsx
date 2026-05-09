import { renderHook, act, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/slices/auth/authSlice';
import wizardReducer from '@/store/slices/wizard/wizardSlice';
import useAuth from './useAuth';
jest.mock('@/services/auth/login', () => ({ login: jest.fn() }));
import { login as loginService } from '@/services/auth/login';

const mockLoginOk = async ({ username }: { username: string }) => ({
  token: 'tok',
  user: { id: '1', username, role: username === 'admin' ? 'admin' : 'user' },
  expiresAt: Date.now() + 60_000,
});

beforeEach(() => {
  (loginService as jest.Mock).mockReset();
  (loginService as jest.Mock).mockImplementation(mockLoginOk);
});

function wrapper({ children }: { children: React.ReactNode }) {
  const store = configureStore({ reducer: { auth: authReducer, wizard: wizardReducer } });
  return <Provider store={store}>{children}</Provider>;
}

describe('useAuth', () => {
  it('logs in and exposes role + isAuthenticated', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(false);
    await act(async () => {
      await result.current.login('admin', 'pw');
    });
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));
    expect(result.current.role).toBe('admin');
  });

  it('logout clears session', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await result.current.login('alice', 'pw');
    });
    act(() => result.current.logout());
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('exposes error message when login fails', async () => {
    (loginService as jest.Mock).mockImplementation(() =>
      Promise.reject(new Error('bad creds')),
    );
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await expect(result.current.login('x', 'y')).rejects.toThrow('bad creds');
    });
    expect(result.current.error).toBe('bad creds');
  });

  it('captures a generic message when the rejection is not an Error', async () => {
    (loginService as jest.Mock).mockImplementation(() => Promise.reject('boom'));
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await expect(result.current.login('x', 'y')).rejects.toBeDefined();
    });
    expect(result.current.error).toBe('Login failed');
  });
});
