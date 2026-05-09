import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBanner from './errorBanner';

describe('ErrorBanner', () => {
  it('renders the message inside an alert role', () => {
    render(<ErrorBanner message="Something went wrong" />);
    expect(screen.getByRole('alert')).toHaveTextContent(/something went wrong/i);
  });

  it('renders a title when provided', () => {
    render(<ErrorBanner title="Heads up" message="details" />);
    expect(screen.getByText(/heads up/i)).toBeInTheDocument();
  });

  it('fires onRetry when Retry is clicked', async () => {
    const user = userEvent.setup();
    const onRetry = jest.fn();
    render(<ErrorBanner message="oops" onRetry={onRetry} retryLabel="Try again" />);
    await user.click(screen.getByRole('button', { name: /try again/i }));
    expect(onRetry).toHaveBeenCalled();
  });

  it('fires onDismiss when Dismiss is clicked', async () => {
    const user = userEvent.setup();
    const onDismiss = jest.fn();
    render(<ErrorBanner message="oops" onDismiss={onDismiss} dismissLabel="Close banner" />);
    await user.click(screen.getByRole('button', { name: /close banner/i }));
    expect(onDismiss).toHaveBeenCalled();
  });

  it('renders success severity when requested', () => {
    render(<ErrorBanner severity="success" message="All good" />);
    const alert = screen.getByRole('alert');
    expect(alert.className).toMatch(/MuiAlert-.*Success/);
  });
});
