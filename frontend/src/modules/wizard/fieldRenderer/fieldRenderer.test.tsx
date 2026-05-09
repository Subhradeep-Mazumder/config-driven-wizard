import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FieldRenderer from './fieldRenderer';
import type { WizardFieldConfig } from '@/types';

describe('FieldRenderer', () => {
  it('renders text input and fires onChange', async () => {
    const user = userEvent.setup();
    const field: WizardFieldConfig = { name: 'n', label: 'Name', type: 'text' };
    const onChange = jest.fn();
    render(<FieldRenderer field={field} value="" error={undefined} onChange={onChange} />);
    await user.type(screen.getByLabelText('Name'), 'Ada');
    expect(onChange).toHaveBeenCalled();
  });

  it('shows error message with alert role', () => {
    const field: WizardFieldConfig = { name: 'n', label: 'Name', type: 'text' };
    render(<FieldRenderer field={field} value="" error="req" onChange={jest.fn()} />);
    expect(screen.getByRole('alert')).toHaveTextContent('req');
  });

  it('renders a select with options', () => {
    const field: WizardFieldConfig = {
      name: 'c',
      label: 'Country',
      type: 'select',
      options: [
        { value: 'us', label: 'US' },
        { value: 'in', label: 'IN' },
      ],
    };
    render(<FieldRenderer field={field} value="us" error={undefined} onChange={jest.fn()} />);
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
  });
});
