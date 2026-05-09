import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/slices/auth/authSlice';
import wizardReducer from '@/store/slices/wizard/wizardSlice';
import Login from './login';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: 'en' } }),
}));
jest.mock('@/services/auth/login', () => ({ login: jest.fn() }));

describe('Login', () => {
  it('renders username and password fields', () => {
    const store = configureStore({ reducer: { auth: authReducer, wizard: wizardReducer } });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByLabelText(/login.username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/login.password/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /login.title|sign in/i })).toBeInTheDocument();
  });
});
