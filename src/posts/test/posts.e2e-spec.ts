import { INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';
import { init_e2e } from '../../shared/test/init.e2e';
import { clearDatabase } from '../../shared/test/utils';
import { CategoryStub } from '../../categories/test/stub/category.stub';
import { CreatedPostStub } from './stub/post.stub';
import { doArraysIntersect } from '../../shared/utils/tests.utils';

describe('PostsController (e2e)', () => {
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

  describe('getPosts', () => {
    let createdCategoryId;
    it('should create a category for the post', async () => {
      const response = await request.post('/categories').send({
        name: CategoryStub().name,
      });
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(CategoryStub());
      createdCategoryId = response.body._id;
    });
    const postStub = CreatedPostStub(createdCategoryId);
    it('should create a post', async () => {
      const response = await request.post('/posts').send({
        slug: postStub.slug,
        title: postStub.title,
        sourceName: postStub.sourceName,
        sourceLink: postStub.sourceLink,
        desc: postStub.desc,
        categories: [createdCategoryId],
      });
      expect(response.status).toBe(201);
      expect(
        doArraysIntersect(Object.keys(response.body), Object.keys(postStub)),
      ).toBe(true);
    });
    it('should get the created post', async () => {
      const response = await request.get('/posts/' + postStub.slug);
      expect(response.status).toBe(200);
      expect(
        doArraysIntersect(Object.keys(response.body), Object.keys(postStub)),
      ).toBe(true);
    });
    it('should not create a duplicate post', async () => {
      const response = await request.post('/posts').send({
        slug: postStub.slug,
        title: postStub.title,
        sourceName: postStub.sourceName,
        sourceLink: postStub.sourceLink,
        desc: postStub.desc,
        categories: [createdCategoryId],
      });
      expect(response.status).toBe(409);
    });
  });

  afterAll(async () => {
    await clearDatabase(dbConnection, 'categories');
    await clearDatabase(dbConnection, 'posts');
    await app.close();
  });
});
