import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/slices/auth/authSlice';
import wizardReducer from '@/store/slices/wizard/wizardSlice';
import Header from './header';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string, o?: Record<string, string>) => (o?.name ? `${k}:${o.name}` : k),
    i18n: { language: 'en', changeLanguage: jest.fn() },
  }),
}));

describe('Header', () => {
  it('renders banner landmark', () => {
    const store = configureStore({ reducer: { auth: authReducer, wizard: wizardReducer } });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});
