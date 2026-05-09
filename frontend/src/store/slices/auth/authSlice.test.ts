import reducer, { loginPending, loginSuccess, loginError, logout } from './authSlice';
import type { AuthState } from './authSlice.d';

describe('authSlice', () => {
  const initial: AuthState = {
    user: null,
    token: null,
    expiresAt: null,
    status: 'idle',
    error: null,
  };

  it('sets loading on loginPending', () => {
    const next = reducer(initial, loginPending());
    expect(next.status).toBe('loading');
  });

  it('stores session on loginSuccess', () => {
    const session = {
      token: 'abc',
      user: { id: '1', username: 'alice', role: 'admin' as const },
      expiresAt: 9999,
    };
    const next = reducer(initial, loginSuccess(session));
    expect(next.token).toBe('abc');
    expect(next.user?.role).toBe('admin');
  });

  it('records error on loginError', () => {
    const next = reducer(initial, loginError('nope'));
    expect(next.status).toBe('error');
    expect(next.error).toBe('nope');
  });

  it('resets on logout', () => {
    const populated: AuthState = {
      user: { id: '1', username: 'alice', role: 'user' },
      token: 't',
      expiresAt: 1,
      status: 'idle',
      error: null,
    };
    expect(reducer(populated, logout())).toEqual(initial);
  });
});
