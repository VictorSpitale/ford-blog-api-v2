import { INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';
import { initE2eWithGuards } from '../../shared/test/init.e2e';
import { clearDatabase } from '../../shared/test/utils';
import { UserStub } from '../../users/test/stub/user.stub';
import { UsersService } from '../../users/users.service';
import { doArraysIntersect } from '../../shared/utils/tests.utils';

describe('auth (e2e)', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let request;
  let usersService: UsersService;

  beforeAll(async () => {
    const {
      httpRequest: req,
      dbConnection: db,
      app: nestApp,
      moduleFixture,
    } = await initE2eWithGuards();
    request = req;
    dbConnection = db;
    app = nestApp;
    usersService = moduleFixture.get<UsersService>(UsersService);
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
    it('should cannot login if user doesnt exist', async () => {
      const response = await request.post('/auth/login').send({
        password: 'password',
        email: 'example@gmail.com',
      });
      expect(response.status).toBe(401);
    });
    it('should cannot login with the wrong password', async () => {
      const response = await request.post('/auth/login').send({
        password: 'blablablabla',
        email: UserStub().email,
      });
      expect(response.status).toBe(401);
    });
    it('should log a user and return a token', async () => {
      const response = await request.post('/auth/login').send({
        email: UserStub().email,
        password: UserStub().password,
      });
      expect(response.status).toBe(200);
      expect(
        doArraysIntersect(Object.keys(response.body), Object.keys(UserStub())),
      ).toBe(true);
      token = response.headers['set-cookie'][0].replace('access_token=', '');
    });
    it('should not give the user id if the jwt is not correct', async () => {
      const response = await request
        .get('/auth/jwt')
        .set('Cookie', `access_token=blabla;`);
      expect(response.status).toBe(401);
    });
    it('should decode the jwt and send the user', async () => {
      const response = await request
        .get('/auth/jwt')
        .set('Cookie', `access_token=${token};`);
      expect(response.status).toBe(200);
      expect(response).not.toBeNull();
      const user = await usersService.getUserByEmail(UserStub().email);
      expect(
        doArraysIntersect(Object.keys(user), Object.keys(response.body)),
      ).toBe(true);
    });
    it('should cannot access protected route without Authorization', async () => {
      const response = await request.get('/posts');
      expect(response.status).toBe(401);
    });

    it('should request a protected route successfully', async () => {
      const response = await request
        .get('/posts')
        .set('Cookie', `access_token=${token};`);
      expect(response.status).toBe(200);
    });
  });
  afterAll(async () => {
    await clearDatabase(dbConnection, 'users');
    await dbConnection.close(true);
    await app.close();
  });
});
