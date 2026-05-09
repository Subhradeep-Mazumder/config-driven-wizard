import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { loginSuccess } from '@/store/slices/auth/authSlice';
import wizardReducer from '@/store/slices/wizard/wizardSlice';
import Wizard from './wizard';
import type { WizardConfig } from '@/types';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string, o?: Record<string, string | number>) =>
      o ? `${k}:${JSON.stringify(o)}` : k,
    i18n: { language: 'en' },
  }),
}));

const mockConfig: WizardConfig = {
  id: 'test',
  title: 'Test Wizard',
  steps: [
    {
      id: 'a',
      title: 'First',
      fields: [
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          validations: [{ type: 'required', message: 'name required' }],
        },
      ],
    },
    {
      id: 'b',
      title: 'Admin Step',
      visibleForRoles: ['admin'],
      fields: [],
    },
    { id: 'c', title: 'Review', fields: [] },
  ],
};

jest.mock('@/common/utills/hooks/useWizardStatusStream', () => ({
  __esModule: true,
  default: () => ({ events: [], latest: null, connected: false }),
}));

jest.mock('@/services/wizard/checkEmailUnique', () => ({
  checkEmailUnique: jest.fn(async () => true),
}));
jest.mock('@/services/wizard/submitWizard', () => ({
  submitWizard: jest.fn(async () => ({ jobId: 'j1' })),
}));

function setup(role: 'admin' | 'user' = 'user') {
  const store = configureStore({ reducer: { auth: authReducer, wizard: wizardReducer } });
  store.dispatch(
    loginSuccess({
      token: 't',
      user: { id: '1', username: 'u', role },
      expiresAt: Date.now() + 60_000,
    }),
  );
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Wizard config={mockConfig} />
      </MemoryRouter>
    </Provider>,
  );
}

describe('Wizard', () => {
  it('renders first step with its field', () => {
    setup();
    expect(screen.getByRole('heading', { name: /test wizard/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });

  it('blocks Next when required field is empty and shows error', async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole('button', { name: /wizard\.next/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/name required/);
  });

  it('hides admin-only step for non-admin role', () => {
    setup('user');
    const nav = screen.getByLabelText('wizard.nav');
    expect(nav).not.toHaveTextContent(/Admin Step/);
  });

  it('shows admin-only step for admin role', () => {
    setup('admin');
    const nav = screen.getByLabelText('wizard.nav');
    expect(nav).toHaveTextContent(/Admin Step/);
  });

  it('advances to next step when validation passes', async () => {
    const user = userEvent.setup();
    setup();
    await user.type(screen.getByLabelText('Name'), 'Ada');
    await user.click(screen.getByRole('button', { name: /wizard\.next/ }));
    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Review/),
    );
  });
});
