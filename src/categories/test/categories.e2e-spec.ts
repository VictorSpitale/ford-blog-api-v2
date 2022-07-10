import { INestApplication } from '@nestjs/common';
import * as Mongoose from 'mongoose';
import { Connection } from 'mongoose';
import { CategoryStub } from './stub/category.stub';
import { clearDatabase } from '../../shared/test/utils';
import { initE2eWithGuards } from '../../shared/test/init.e2e';
import { UserStub } from '../../users/test/stub/user.stub';
import { AuthService } from '../../auth/auth.service';
import { IUserRole } from '../../users/entities/users.role.interface';
import { CreatePostStub } from '../../posts/test/stub/post.stub';
import { PostDto } from '../../posts/dto/post.dto';

describe.only('CategoriesController (e2e)', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let request;
  let authService: AuthService;

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
    authService = moduleFixture.get<AuthService>(AuthService);
  });

  describe('getCategories', () => {
    it('should return an array of categories', async () => {
      await dbConnection.collection('categories').insertOne(CategoryStub());
      const response = await request.get('/categories');
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject([CategoryStub()]);
      await clearDatabase(dbConnection, 'categories');
    });
  });

  describe('falling getCategory', () => {
    it('should failed to get a category if id is invalid', async () => {
      const response = await request.get('/categories/eee');
      expect(response.status).toBe(400);
    });
    it('should failed to get a category if it doesnt exist', async () => {
      const mockObjectId = new Mongoose.Types.ObjectId();
      const response = await request.get(`/categories/${mockObjectId}`);
      expect(response.status).toBe(404);
    });
  });

  describe('create category', () => {
    let createdCategoryId;
    let user;
    let token;
    beforeAll(async () => {
      user = UserStub(IUserRole.ADMIN);
      await dbConnection.collection('users').insertOne(user);
      token = authService.signToken(user);
    });
    it('should create a category when user is admin', async () => {
      const response = await request
        .post('/categories')
        .send({
          name: CategoryStub().name,
        })
        .set('Cookie', `access_token=${token};`);
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(CategoryStub());
      createdCategoryId = response.body._id;
    });
    it('should get the created category', async () => {
      const response = await request.get('/categories/' + createdCategoryId);
      expect(response.status).toBe(200);
    });
    it('should not create a duplicate category', async () => {
      const response = await request
        .post('/categories')
        .send({
          name: CategoryStub().name,
        })
        .set('Cookie', `access_token=${token};`);
      expect(response.status).toBe(409);
    });
    afterAll(async () => {
      await clearDatabase(dbConnection, 'users');
    });
  });

  describe('create category not logged in', () => {
    it('should not create a category is user is not login', async () => {
      const response = await request.post('/categories').send({
        name: CategoryStub().name,
      });
      expect(response.status).toBe(401);
    });
    it('should not create a category when user is not admin', async () => {
      const user = UserStub();
      await dbConnection.collection('users').insertOne(user);
      const token = authService.signToken(user);
      const response = await request
        .post('/categories')
        .send({
          name: CategoryStub().name,
        })
        .set('Cookie', `access_token=${token};`);
      expect(response.status).toBe(401);
    });

    afterEach(async () => {
      await clearDatabase(dbConnection, 'posts');
      await clearDatabase(dbConnection, 'categories');
      await clearDatabase(dbConnection, 'users');
    });
  });

  describe('delete a category', () => {
    describe('failing delete category', () => {
      it('should fail to delete a category while not logged in', async () => {
        const category = CategoryStub();
        await dbConnection.collection('categories').insertOne(category);
        const response = await request.delete(`/categories/${category._id}`);
        expect(response.status).toBe(401);
      });
      it('should fail to delete a category while not an admin', async () => {
        const category = CategoryStub();
        const user = UserStub();
        await dbConnection.collection('categories').insertOne(category);
        await dbConnection.collection('users').insertOne(user);
        const token = authService.signToken(user);
        const response = await request
          .delete(`/categories/${category._id}`)
          .set('Cookie', `access_token=${token};`);
        expect(response.status).toBe(401);
      });
      it('should fail to delete a non-existent category', async () => {
        const user = UserStub(IUserRole.ADMIN);
        await dbConnection.collection('users').insertOne(user);
        const token = authService.signToken(user);
        const response = await request
          .delete(`/categories/${new Mongoose.Types.ObjectId()}`)
          .set('Cookie', `access_token=${token};`);
        expect(response.status).toBe(404);
      });
    });

    describe('delete a category', () => {
      it('should delete cascade a category', async () => {
        const category = CategoryStub();
        let post = CreatePostStub();
        post = {
          ...post,
          categories: [category._id],
        };
        const user = UserStub(IUserRole.ADMIN);
        await dbConnection.collection('categories').insertOne(category);
        await dbConnection.collection('users').insertOne(user);
        const token = authService.signToken(user);
        await request
          .post(`/posts`)
          .set('Cookie', `access_token=${token};`)
          .send(post);
        const response = await request
          .delete(`/categories/${category._id}`)
          .set('Cookie', `access_token=${token};`);
        const queriedPosts = (await dbConnection
          .collection('posts')
          .findOne({ slug: post.slug })) as PostDto;
        expect(queriedPosts.categories).toEqual([]);
        expect(response.status).toBe(200);
      });
    });

    afterEach(async () => {
      await clearDatabase(dbConnection, 'posts');
      await clearDatabase(dbConnection, 'categories');
      await clearDatabase(dbConnection, 'users');
    });
  });

  afterAll(async () => {
    await clearDatabase(dbConnection, 'categories');
    await clearDatabase(dbConnection, 'users');
    await dbConnection.close(true);
    await app.close();
  });
});
