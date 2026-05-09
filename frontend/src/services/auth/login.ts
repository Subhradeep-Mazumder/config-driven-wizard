import { getHttpClient } from '@/services/http/client';
import type { LoginRequest, LoginResponse } from './login.d';

export async function login(req: LoginRequest): Promise<LoginResponse> {
  const http = getHttpClient();
  const { data } = await http.post<LoginResponse>('/api/auth/login', req);
  return data;
}

export default login;
