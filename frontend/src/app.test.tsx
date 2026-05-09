import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './store/slices/auth/authSlice';
import wizardReducer from './store/slices/wizard/wizardSlice';
import App from './app';

jest.mock('./i18n', () => ({}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string, o?: Record<string, string>) => (o?.name ? `${k}:${o.name}` : k),
    i18n: { language: 'en', changeLanguage: jest.fn() },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
}));

function renderApp(initialEntries: string[] = ['/login']) {
  const store = configureStore({
    reducer: { auth: authReducer, wizard: wizardReducer },
  });
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <App />
      </MemoryRouter>
    </Provider>,
  );
}

describe('App', () => {
  it('renders the header', () => {
    renderApp();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('redirects unauthenticated users to login (lazy-loaded)', async () => {
    renderApp(['/']);
    expect(
      await screen.findByRole('heading', { name: /login\.title/i }),
    ).toBeInTheDocument();
  });
});
