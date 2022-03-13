import { INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';

import { UserStub, UserStubWithoutPasswordAndDates } from './stub/user.stub';
import { clearDatabase } from '../../shared/test/utils';
import { init_e2e } from '../../shared/test/init.e2e';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let request;

  beforeAll(async () => {
    const {
      httpRequest: req,
      dbConnection: db,
      app: nestApp,
    } = await init_e2e();
    request = req;
    dbConnection = db;
    app = nestApp;
  });

  describe('getUsers', function () {
    beforeEach(async () => {
      await clearDatabase(dbConnection, 'users');
    });

    it('should return an array of users', async () => {
      await dbConnection.collection('users').insertOne(UserStub());
      const response = await request.get('/users');
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject([UserStubWithoutPasswordAndDates()]);
    });
  });

  describe('createUsers', () => {
    beforeAll(async () => {
      await clearDatabase(dbConnection, 'users');
    });
    it('should not create a user with too short pseudo', async () => {
      const response = await request.post('/users').send({
        password: UserStub().password,
        pseudo: 'John',
        email: UserStub().email,
      });
      expect(response.status).toBe(400);
    });
    it('should not create a user with too short password', async () => {
      const response = await request.post('/users').send({
        password: 'pass',
        pseudo: UserStub().pseudo,
        email: UserStub().email,
      });
      expect(response.status).toBe(400);
    });
    it('should not create a user with too long pseudo', async () => {
      const response = await request.post('/users').send({
        password: UserStub().password,
        pseudo: 'JohnJohnJohnJohnJohnJohnJohn',
        email: UserStub().email,
      });
      expect(response.status).toBe(400);
    });
    it('should not create a user with not valid email', async () => {
      const response = await request.post('/users').send({
        password: UserStub().password,
        pseudo: UserStub().pseudo,
        email: 'john@doe',
      });
      expect(response.status).toBe(400);
    });
    let createdUserId;
    it('should create a user', async () => {
      const response = await request.post('/users').send({
        password: UserStub().password,
        pseudo: UserStub().pseudo,
        email: UserStub().email,
      });
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(UserStubWithoutPasswordAndDates());
      createdUserId = response.body._id;
    });
    it('should get the created user', async () => {
      const response = await request.get('/users/' + createdUserId);
      expect(response.status).toBe(200);
    });
    it('should not create a duplicate user', async () => {
      const response = await request.post('/users').send({
        password: UserStub().password,
        pseudo: UserStub().pseudo,
        email: UserStub().email,
      });
      expect(response.status).toBe(409);
    });
  });

  afterAll(async () => {
    await clearDatabase(dbConnection, 'users');
    await app.close();
  });
});
