import { INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';
import { initE2eWithGuards } from '../../shared/test/init.e2e';
import { clearDatabase } from '../../shared/test/utils';
import { UserStub } from '../../users/test/stub/user.stub';

describe('auth (e2e)', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let request;

  beforeAll(async () => {
    const {
      httpRequest: req,
      dbConnection: db,
      app: nestApp,
    } = await initE2eWithGuards();
    request = req;
    dbConnection = db;
    app = nestApp;
  });
  describe('/login and test token', () => {
    it('should create a user', async () => {
      const response = await request.post('/users').send({
        password: UserStub().password,
        pseudo: UserStub().pseudo,
        email: UserStub().email,
      });
      expect(response.status).toBe(201);
    });
    let token;
    it('should log a user and return a token', async () => {
      const response = await request.post('/auth/login').send({
        email: UserStub().email,
        password: UserStub().password,
      });
      expect(response.status).toBe(200);
      expect(Object.keys(response.body)).toContain('access_token');
      token = response.body.access_token;
    });

    it('should cannot access protected route without Authorization', async () => {
      const response = await request.get('/posts');
      expect(response.status).toBe(401);
    });

    it('should request a protected route successfully', async () => {
      const response = await request.get('/posts').set({
        Authorization: `Bearer ${token}`,
      });
      expect(response.status).toBe(200);
    });
  });
  afterAll(async () => {
    await clearDatabase(dbConnection, 'users');
    await app.close();
  });
});
