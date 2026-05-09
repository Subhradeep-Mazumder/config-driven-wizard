import type { ReactNode } from 'react';
import type { Role } from '@/types';

export interface RequireAuthProps {
  children: ReactNode;
  roles?: Role[];
}
