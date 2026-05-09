import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { loginSuccess } from '@/store/slices/auth/authSlice';
import wizardReducer from '@/store/slices/wizard/wizardSlice';
import Home from './home';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string, o?: Record<string, string>) => (o?.name ? `${k}:${o.name}` : k),
    i18n: { language: 'en' },
  }),
}));

describe('Home', () => {
  it('shows the welcome heading', () => {
    const store = configureStore({ reducer: { auth: authReducer, wizard: wizardReducer } });
    store.dispatch(
      loginSuccess({
        token: 't',
        user: { id: '1', username: 'alice', role: 'user' },
        expiresAt: Date.now() + 1000,
      }),
    );
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByRole('heading', { name: /alice/ })).toBeInTheDocument();
  });
});
