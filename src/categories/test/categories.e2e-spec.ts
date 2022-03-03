import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Connection } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { DatabaseService } from '../../database/database.service';
import { CategoryStub } from './stub/category.stub';
import * as request from 'supertest';
import { clearDatabase } from '../../shared/test/utils';

describe('CategoriesController (e2e)', () => {
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

  describe('getCategories', () => {
    beforeEach(async () => {
      await dbConnection.collection('categories').deleteMany({});
    });

    it('should return an array of categories', async () => {
      await dbConnection.collection('categories').insertOne(CategoryStub());
      const response = await request(httpServer).get('/categories');
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject([CategoryStub()]);
    });
  });

  describe('create category', () => {
    beforeAll(async () => {
      await clearDatabase(dbConnection, 'categories');
    });
    let createdCategoryId;
    it('should create a category', async () => {
      const response = await request(httpServer).post('/categories').send({
        name: CategoryStub().name,
      });
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(CategoryStub());
      createdCategoryId = response.body._id;
    });
    it('should get the created category', async () => {
      const response = await request(httpServer).get(
        '/categories/' + createdCategoryId,
      );
      expect(response.status).toBe(200);
    });
    it('should not create a duplicate category', async () => {
      const response = await request(httpServer).post('/categories').send({
        name: CategoryStub().name,
      });
      expect(response.status).toBe(409);
    });
  });

  afterAll(async () => {
    await clearDatabase(dbConnection, 'categories');
    await app.close();
  });
});