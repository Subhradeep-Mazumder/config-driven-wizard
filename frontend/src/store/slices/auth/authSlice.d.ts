import type { AuthSession, AuthUser } from '@/types';

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  expiresAt: number | null;
  status: 'idle' | 'loading' | 'error';
  error: string | null;
}

export type { AuthSession };
