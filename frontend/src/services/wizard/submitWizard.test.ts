import submitWizard from './submitWizard';
import { getHttpClient } from '@/services/http/client';

jest.mock('@/services/http/client');

describe('submitWizard', () => {
  it('POSTs values and returns jobId', async () => {
    const post = jest.fn().mockResolvedValue({ data: { jobId: 'job-1' } });
    (getHttpClient as jest.Mock).mockReturnValue({ post });
    const result = await submitWizard({ values: { email: 'a@b.co' } });
    expect(result).toEqual({ jobId: 'job-1' });
    expect(post).toHaveBeenCalledWith('/api/wizard/submit', {
      values: { email: 'a@b.co' },
    });
  });
});
