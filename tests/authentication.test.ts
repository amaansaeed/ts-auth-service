import server from '../src/index';
import request from 'supertest';
import db from '../src/db';
import { seed } from '../src/db/seeds/user_auth_seed';

const createTables = () => {
  return db.knex.schema.createTable('user_auth', table => {
    table.uuid('user_id').primary();
    table
      .string('email')
      .notNullable()
      .unique();
    table
      .string('username')
      .notNullable()
      .unique();
    table.string('password').notNullable();
    table.dateTime('created_at');
    table.dateTime('updated_at').nullable();
    table.dateTime('deleted_at').nullable();
  });
};

const cleanUp = () => {
  return db.knex.schema.dropTableIfExists('user_auth');
};

describe('Routes: auth', () => {
  beforeAll(async () => {
    await createTables();
    await seed(db.knex);
  });

  afterAll(async () => {
    await cleanUp();
    db.knex.destroy();
    server.close();
  });

  describe('GET /auth', () => {
    const credsPass = { identifier: 'hobbes', password: 'password123' };
    const credsFail1 = { password: 'password123' };
    const credsFail2 = { identifier: 'hobbes' };
    const credsFail3 = { identifier: 'hobbes', password: 'sadasdasd' };

    it('should authenticate a user with valid credentials', async () => {
      const response = await request(server)
        .get('/auth')
        .send(credsPass);

      expect(response.status).toBe(200);
      expect(response.header['access-token']).toBeDefined();
    });

    it('should NOT authenticate a user without identifier', async () => {
      const response = await request(server)
        .get('/auth')
        .send(credsFail1);

      expect(response.status).toBe(422);
      expect(response.header['access-token']).toBeUndefined();
    });

    it('should NOT authenticate a user without password', async () => {
      const response = await request(server)
        .get('/auth')
        .send(credsFail2);

      expect(response.status).toBe(422);
      expect(response.header['access-token']).toBeUndefined();
    });

    it('should NOT authenticate a user with invalid credentials', async () => {
      const response = await request(server)
        .get('/auth')
        .send(credsFail3);

      expect(response.status).toBe(401);
      expect(response.header['access-token']).toBeUndefined();
    });
  });

  describe('POST /auth', () => {
    const userPass = {
      username: 'sansa',
      email: 'sansa@email.com',
      password: 'password123',
    };
    const userFail1 = { email: 'sansa@email.com', password: 'password123' };
    const userFail2 = { username: 'sansa', password: 'password123' };
    const userFail3 = { username: 'sansa', email: 'sansa@email.com' };
    const userFail4 = {
      username: 'sansa',
      email: 'sansa1@email.com',
      password: 'password123',
    };
    const userFail5 = {
      username: 'sansa1',
      email: 'sansa@email.com',
      password: 'password123',
    };

    it('should create a user with valid username, email, password', async () => {
      const response = await request(server)
        .post('/auth')
        .send(userPass);

      expect(response.status).toBe(200);
      expect(response.header['access-token']).toBeDefined();
    });

    it('should NOT create a user without a username', async () => {
      const response = await request(server)
        .post('/auth')
        .send(userFail1);

      expect(response.status).toBe(422);
      expect(response.header['access-token']).toBeUndefined();
    });

    it('should NOT create a user without a email', async () => {
      const response = await request(server)
        .post('/auth')
        .send(userFail2);

      expect(response.status).toBe(422);
      expect(response.header['access-token']).toBeUndefined();
    });

    it('should NOT create a user without a password', async () => {
      const response = await request(server)
        .post('/auth')
        .send(userFail3);

      expect(response.status).toBe(422);
      expect(response.header['access-token']).toBeUndefined();
    });

    it('should NOT create a user with a taken username', async () => {
      const response = await request(server)
        .post('/auth')
        .send(userFail4);

      expect(response.status).toBe(412);
      expect(response.header['access-token']).toBeUndefined();
    });

    it('should NOT create a user with a taken email', async () => {
      const response = await request(server)
        .post('/auth')
        .send(userFail5);

      expect(response.status).toBe(412);
      expect(response.header['access-token']).toBeUndefined();
    });
  });
});
