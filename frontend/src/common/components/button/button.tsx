import { Button as MuiButton } from '@mui/material';
import type { ButtonProps } from './button.d';
import './button.scss';

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'contained',
  disabled,
  ariaLabel,
  className,
  color = 'primary',
}: ButtonProps) {
  return (
    <MuiButton
      type={type}
      variant={variant}
      color={color}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={['button', className].filter(Boolean).join(' ')}
    >
      {children}
    </MuiButton>
  );
}

export default Button;
