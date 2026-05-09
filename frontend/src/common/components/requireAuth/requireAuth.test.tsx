import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { loginSuccess } from '@/store/slices/auth/authSlice';
import wizardReducer from '@/store/slices/wizard/wizardSlice';
import RequireAuth from './requireAuth';

function makeStore(preloaded?: Parameters<typeof loginSuccess>[0]) {
  const store = configureStore({ reducer: { auth: authReducer, wizard: wizardReducer } });
  if (preloaded) store.dispatch(loginSuccess(preloaded));
  return store;
}

function renderWith(node: React.ReactNode, store: ReturnType<typeof makeStore>) {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/secret']}>
        <Routes>
          <Route path="/login" element={<div>login page</div>} />
          <Route path="/secret" element={node} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

describe('RequireAuth', () => {
  it('redirects to login when unauthenticated', () => {
    renderWith(<RequireAuth>secret</RequireAuth>, makeStore());
    expect(screen.getByText('login page')).toBeInTheDocument();
  });

  it('renders children when authenticated', () => {
    const store = makeStore({
      token: 't',
      user: { id: '1', username: 'a', role: 'user' },
      expiresAt: Date.now() + 60_000,
    });
    renderWith(<RequireAuth>secret</RequireAuth>, store);
    expect(screen.getByText('secret')).toBeInTheDocument();
  });

  it('denies access when role is not allowed', () => {
    const store = makeStore({
      token: 't',
      user: { id: '1', username: 'a', role: 'user' },
      expiresAt: Date.now() + 60_000,
    });
    renderWith(<RequireAuth roles={['admin']}>secret</RequireAuth>, store);
    expect(screen.getByRole('alert')).toHaveTextContent(/forbidden/i);
  });
});
