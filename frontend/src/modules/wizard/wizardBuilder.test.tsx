import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { loginSuccess } from '@/store/slices/auth/authSlice';
import wizardReducer from '@/store/slices/wizard/wizardSlice';
import WizardBuilder from './wizardBuilder';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: { language: 'en' },
  }),
}));

jest.mock('@/common/utills/hooks/useWizardStatusStream', () => ({
  __esModule: true,
  default: () => ({ events: [], latest: null, connected: false }),
}));

function setup() {
  const store = configureStore({ reducer: { auth: authReducer, wizard: wizardReducer } });
  store.dispatch(
    loginSuccess({
      token: 't',
      user: { id: '1', username: 'u', role: 'admin' },
      expiresAt: Date.now() + 60_000,
    }),
  );
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <WizardBuilder />
      </MemoryRouter>
    </Provider>,
  );
}

describe('WizardBuilder', () => {
  it('renders the JSON editor with the default sample', () => {
    setup();
    const textarea = screen.getByLabelText('builder.jsonLabel') as HTMLTextAreaElement;
    expect(textarea.value).toContain('"Onboarding Wizard"');
  });

  it('renders the wizard preview from the default config', () => {
    setup();
    expect(screen.getByRole('heading', { name: /onboarding wizard/i })).toBeInTheDocument();
  });

  it('shows invalid-JSON status when config is malformed', async () => {
    const user = userEvent.setup();
    setup();
    const textarea = screen.getByLabelText('builder.jsonLabel');
    await user.clear(textarea);
    await user.click(textarea);
    await user.paste('{ not json');
    expect(screen.getByRole('status')).toHaveTextContent(/builder\.invalid/);
  });

  it('re-renders the preview when Apply is clicked with new JSON', async () => {
    const user = userEvent.setup();
    setup();
    const textarea = screen.getByLabelText('builder.jsonLabel');
    await user.clear(textarea);
    const newConfig = JSON.stringify({
      id: 'x',
      title: 'Custom Title',
      steps: [{ id: 's', title: 'Only', fields: [] }],
    });
    await user.click(textarea);
    await user.paste(newConfig);
    await user.click(screen.getByRole('button', { name: /builder\.apply/ }));
    expect(screen.getByRole('heading', { name: /custom title/i })).toBeInTheDocument();
  });
});
