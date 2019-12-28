import server from '../src/index';
import request from 'supertest';

describe('Routes: auth', () => {
  beforeAll(() => {});

  afterAll(() => {
    server.close();
  });

  describe('GET /auth/health', () => {
    it('should return server healthy', async () => {
      const response = await request(server).get('/auth/health');
      expect(response.status).toBe(200);
      expect(response.body.message).toEqual('server healthy!');
    });
  });
});
