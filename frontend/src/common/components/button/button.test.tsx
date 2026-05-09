import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './button';

describe('Button', () => {
  it('renders children and fires onClick', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Save</Button>);
    const btn = screen.getByRole('button', { name: /save/i });
    await user.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies the aria-label', () => {
    render(<Button ariaLabel="Submit form">Go</Button>);
    expect(screen.getByLabelText('Submit form')).toBeInTheDocument();
  });

  it('is disabled when prop set', () => {
    render(<Button disabled>X</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
