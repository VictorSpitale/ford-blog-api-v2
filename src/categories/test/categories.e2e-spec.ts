import { INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';
import { CategoryStub } from './stub/category.stub';
import { clearDatabase } from '../../shared/test/utils';
import { init_e2e } from '../../shared/test/init.e2e';

describe('CategoriesController (e2e)', () => {
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

  describe('getCategories', () => {
    beforeEach(async () => {
      await dbConnection.collection('categories').deleteMany({});
    });

    it('should return an array of categories', async () => {
      await dbConnection.collection('categories').insertOne(CategoryStub());
      const response = await request.get('/categories');
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
      const response = await request.post('/categories').send({
        name: CategoryStub().name,
      });
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(CategoryStub());
      createdCategoryId = response.body._id;
    });
    it('should get the created category', async () => {
      const response = await request.get('/categories/' + createdCategoryId);
      expect(response.status).toBe(200);
    });
    it('should not create a duplicate category', async () => {
      const response = await request.post('/categories').send({
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
