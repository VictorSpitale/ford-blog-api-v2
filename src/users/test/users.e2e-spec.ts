import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { DatabaseService } from '../../database/database.service';
import { AppModule } from '../../app.module';

import { UserStub, UserStubWithoutPasswordAndDates } from './stub/user.stub';
import { clearDatabase } from '../../shared/test/utils';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let httpServer: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    dbConnection = moduleFixture
      .get<DatabaseService>(DatabaseService)
      .getDbHandle();
    httpServer = app.getHttpServer();
  });

  describe('getUsers', function () {
    beforeEach(async () => {
      await clearDatabase(dbConnection, 'users');
    });

    it('should return an array of users', async () => {
      await dbConnection.collection('users').insertOne(UserStub());
      const response = await request(httpServer).get('/users');
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject([UserStubWithoutPasswordAndDates()]);
    });
  });

  describe('createUsers', () => {
    beforeAll(async () => {
      await clearDatabase(dbConnection, 'users');
    });
    it('should not create a user with too short pseudo', async () => {
      const response = await request(httpServer).post('/users').send({
        password: UserStub().password,
        pseudo: 'John',
        email: UserStub().email,
      });
      expect(response.status).toBe(400);
    });
    it('should not create a user with too short password', async () => {
      const response = await request(httpServer).post('/users').send({
        password: 'pass',
        pseudo: UserStub().pseudo,
        email: UserStub().email,
      });
      expect(response.status).toBe(400);
    });
    it('should not create a user with too long pseudo', async () => {
      const response = await request(httpServer).post('/users').send({
        password: UserStub().password,
        pseudo: 'JohnJohnJohnJohnJohnJohnJohn',
        email: UserStub().email,
      });
      expect(response.status).toBe(400);
    });
    it('should not create a user with not valid email', async () => {
      const response = await request(httpServer).post('/users').send({
        password: UserStub().password,
        pseudo: UserStub().pseudo,
        email: 'john@doe',
      });
      expect(response.status).toBe(400);
    });
    let createdUserId;
    it('should create a user', async () => {
      const response = await request(httpServer).post('/users').send({
        password: UserStub().password,
        pseudo: UserStub().pseudo,
        email: UserStub().email,
      });
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(UserStubWithoutPasswordAndDates());
      createdUserId = response.body._id;
    });
    it('should get the created user', async () => {
      const response = await request(httpServer).get('/users/' + createdUserId);
      expect(response.status).toBe(200);
    });
    it('should not create a duplicate user', async () => {
      const response = await request(httpServer).post('/users').send({
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
