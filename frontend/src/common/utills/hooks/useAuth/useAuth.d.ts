import type { AuthUser, Role } from '@/types';

export interface UseAuthReturn {
  user: AuthUser | null;
  role: Role;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}
