import { login } from './login';

jest.mock('@/services/http/client', () => ({
  getHttpClient: () => ({
    post: jest.fn(async (_url: string, body: { username: string }) => ({
      data: {
        token: 'tok',
        user: { id: '1', username: body.username, role: 'user' },
        expiresAt: Date.now() + 1000,
      },
    })),
  }),
}));

describe('services/auth/login', () => {
  it('returns session on success', async () => {
    const res = await login({ username: 'alice', password: 'pw' });
    expect(res.token).toBe('tok');
    expect(res.user.username).toBe('alice');
  });
});
