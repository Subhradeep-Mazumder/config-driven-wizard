import type { ReactNode } from 'react';

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'contained' | 'outlined' | 'text';
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
  color?: 'primary' | 'secondary' | 'error';
}
