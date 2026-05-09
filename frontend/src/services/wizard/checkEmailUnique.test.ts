import checkEmailUnique from './checkEmailUnique';
import { getHttpClient } from '@/services/http/client';

jest.mock('@/services/http/client');

describe('checkEmailUnique', () => {
  it('returns true when server says unique', async () => {
    const get = jest.fn().mockResolvedValue({ data: { unique: true } });
    (getHttpClient as jest.Mock).mockReturnValue({ get });
    await expect(checkEmailUnique('a@b.co')).resolves.toBe(true);
    expect(get).toHaveBeenCalledWith('/api/wizard/check-email', {
      params: { email: 'a@b.co' },
    });
  });

  it('returns false when server says taken', async () => {
    const get = jest.fn().mockResolvedValue({ data: { unique: false } });
    (getHttpClient as jest.Mock).mockReturnValue({ get });
    await expect(checkEmailUnique('taken@example.com')).resolves.toBe(false);
  });
});
