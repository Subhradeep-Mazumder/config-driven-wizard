import type { AuthSession } from '@/types';

export interface LoginRequest {
  username: string;
  password: string;
}

export type LoginResponse = AuthSession;
