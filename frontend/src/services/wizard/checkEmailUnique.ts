import { getHttpClient } from '@/services/http/client';
import type { EmailUniqueResponse } from './checkEmailUnique.d';

export async function checkEmailUnique(email: string): Promise<boolean> {
  const http = getHttpClient();
  const { data } = await http.get<EmailUniqueResponse>('/api/wizard/check-email', {
    params: { email },
  });
  return data.unique;
}

export default checkEmailUnique;
