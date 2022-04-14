import { INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';
import { initE2eWithGuards } from '../../shared/test/init.e2e';
import { clearDatabase } from '../../shared/test/utils';
import { PostStub } from './stub/post.stub';
import { doArraysIntersect } from '../../shared/utils/tests.utils';
import { urlRegex } from '../../shared/utils/regex.validation';
import { AuthService } from '../../auth/auth.service';
import { UserStub } from '../../users/test/stub/user.stub';
import { IUserRole } from '../../users/entities/users.role.interface';

describe('PostsController (e2e)', () => {
  let app: INestApplication;
  let request;
  let dbConnection: Connection;
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

  describe('createPost', () => {
    describe('successfully create a post', () => {
      it('should create a post', async () => {
        const post = PostStub();
        const user = UserStub(IUserRole.POSTER);
        const token = authService.signToken(user);
        await dbConnection.collection('users').insertOne(user);
        const response = await request
          .post('/posts')
          .send(post)
          .set('Cookie', `access_token=${token};`);
        expect(response.status).toBe(201);
        expect(
          doArraysIntersect(
            [...Object.keys(post), 'authUserLiked'],
            [...Object.keys(response.body)],
          ),
        ).toBe(true);
      });
      afterAll(async () => {
        await clearDatabase(dbConnection, 'users');
        await clearDatabase(dbConnection, 'posts');
      });
    });
    describe('failing create post', () => {
      it('should not create a post while not logged in', async () => {
        const post = PostStub();
        const response = await request.post('/posts').send(post);
        expect(response.status).toBe(401);
      });
      it('should not create a post while not being poster', async () => {
        const post = PostStub();
        const user = UserStub();
        const token = authService.signToken(user);
        const response = await request
          .post('/posts')
          .send(post)
          .set('Cookie', `access_token=${token};`);
        expect(response.status).toBe(401);
      });
      it('should not create a post with missing fields', async () => {
        const { slug, ...other } = PostStub();
        const user = UserStub(IUserRole.POSTER);
        const token = authService.signToken(user);
        await dbConnection.collection('users').insertOne(user);
        const response = await request
          .post('/posts')
          .send(other)
          .set('Cookie', `access_token=${token};`);
        expect(response.status).toBe(400);
      });
      it('should not create a post with invalid source link format', async () => {
        const post = PostStub();
        const user = UserStub(IUserRole.POSTER);
        const token = authService.signToken(user);
        await dbConnection.collection('users').insertOne(user);
        const response = await request
          .post('/posts')
          .send({
            ...post,
            sourceLink: 'blabla',
          })
          .set('Cookie', `access_token=${token};`);
        expect(response.status).toBe(400);
      });
      it('should not create a duplicate post', async () => {
        const post = PostStub();
        const user = UserStub(IUserRole.POSTER);
        const token = authService.signToken(user);
        await dbConnection.collection('users').insertOne(user);
        await dbConnection.collection('posts').insertOne(post);
        const response = await request
          .post('/posts')
          .send(post)
          .set('Cookie', `access_token=${token};`);
        expect(response.status).toBe(409);
      });
      afterEach(async () => {
        await clearDatabase(dbConnection, 'users');
        await clearDatabase(dbConnection, 'posts');
      });
    });
  });

  describe('getAllPosts', () => {
    describe('get all posts while not logged in', () => {
      it('should not return the posts', async () => {
        const response = await request.get('/posts');
        expect(response.status).toBe(401);
      });
    });

    describe('get all posts while logged in', () => {
      it('should get all posts', async () => {
        const user = UserStub();
        const post = PostStub();
        const token = authService.signToken(user);
        await dbConnection.collection('users').insertOne(user);
        await dbConnection.collection('posts').insertOne(post);
        const response = await request
          .get('/posts')
          .set('Cookie', `access_token=${token};`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(1);
        expect(
          doArraysIntersect(
            [...Object.keys(post), 'authUserLiked'],
            [...Object.keys(response.body[0])],
          ),
        ).toBe(true);
      });
      afterAll(async () => {
        await clearDatabase(dbConnection, 'users');
        await clearDatabase(dbConnection, 'posts');
      });
    });
  });

  describe('getLastPosts', () => {
    it('should get the last 6 posts', async () => {
      await dbConnection
        .collection('posts')
        .insertMany([
          PostStub('un'),
          PostStub('deux'),
          PostStub('trois'),
          PostStub('quatre'),
          PostStub('cinq'),
          PostStub('six'),
          PostStub('sept'),
        ]);
      const response = await request.get('/posts/last');
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeLessThan(7);
    });
    afterAll(async () => {
      await clearDatabase(dbConnection, 'posts');
    });
  });

  describe('queryPosts', () => {
    it('should not query posts when the search param is less than 3 characters', async () => {
      const response = await request.get('/posts/query?search=e');
      expect(response.status).toBe(400);
    });
    it('should return a list of posts, max 5 posts', async () => {
      const post = PostStub('puma');
      await dbConnection.collection('posts').insertOne(post);
      const response = await request.get('/posts/query?search=puma');
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(
        doArraysIntersect(
          [...Object.keys(post), 'authUserLiked'],
          [...Object.keys(response.body[0])],
        ),
      ).toBe(true);
      expect(response.body.length).toBeLessThan(6);
    });
    afterAll(async () => {
      await clearDatabase(dbConnection, 'posts');
    });
  });

  describe('getPostBySlug', () => {
    it('should fail to get non-existent post', async () => {
      const response = await request.get('/posts/slug');
      expect(response.status).toBe(404);
    });
    it('should get the post by its slug', async () => {
      await dbConnection.collection('posts').insertOne(PostStub());
      const response = await request.get(`/posts/${PostStub().slug}`);
      expect(response.status).toBe(200);
      expect(
        doArraysIntersect(
          [...Object.keys(PostStub()), 'authUserLiked'],
          [...Object.keys(response.body)],
        ),
      ).toBe(true);
      expect(response.body.sourceLink).toMatch(urlRegex);
    });
    afterAll(async () => {
      await clearDatabase(dbConnection, 'posts');
    });
  });

  describe('change like status on a post', () => {
    describe('like then unlike a post', () => {
      let token;
      let post;
      it('should like a post', async () => {
        const user = UserStub();
        post = PostStub();
        await dbConnection.collection('users').insertOne(user);
        await dbConnection.collection('posts').insertOne(post);
        token = authService.signToken(user);
        const response = await request
          .patch(`/posts/like/${post.slug}`)
          .set('Cookie', `access_token=${token};`);
        expect(response.status).toBe(200);
        expect(response.text).toBe('1');
      });
      it('should unlike a post', async () => {
        const response = await request
          .patch(`/posts/unlike/${post.slug}`)
          .set('Cookie', `access_token=${token};`);
        expect(response.status).toBe(200);
        expect(response.text).toBe('0');
      });
      afterAll(async () => {
        await clearDatabase(dbConnection, 'users');
        await clearDatabase(dbConnection, 'posts');
      });
    });

    describe('failing status change', () => {
      describe('like', () => {
        it('should not like a post while not being auth', async () => {
          const post = PostStub();
          await dbConnection.collection('posts').insertOne(post);
          const response = await request.patch(`/posts/like/${post.slug}`);
          expect(response.status).toBe(401);
        });
        it('should not like an non-existent post', async () => {
          const user = UserStub();
          await dbConnection.collection('users').insertOne(user);
          const token = authService.signToken(user);
          const response = await request
            .patch(`/posts/like/eee`)
            .set('Cookie', `access_token=${token};`);
          expect(response.status).toBe(404);
        });
      });
      describe('unlike', () => {
        it('should not unlike a post while not being auth', async () => {
          const post = PostStub();
          await dbConnection.collection('posts').insertOne(post);
          const response = await request.patch(`/posts/unlike/${post.slug}`);
          expect(response.status).toBe(401);
        });
        it('should not unlike an non-existent post', async () => {
          const user = UserStub();
          await dbConnection.collection('users').insertOne(user);
          const token = authService.signToken(user);
          const response = await request
            .patch(`/posts/unlike/eee`)
            .set('Cookie', `access_token=${token};`);
          expect(response.status).toBe(404);
        });
      });
      afterEach(async () => {
        await clearDatabase(dbConnection, 'users');
        await clearDatabase(dbConnection, 'posts');
      });
    });
  });

  describe('delete a post', () => {
    describe('failing delete post', () => {
      it('should fail to delete a post while not logged in', async () => {
        const post = PostStub();
        await dbConnection.collection('posts').insertOne(post);
        const response = await request.delete(`/posts/${post.slug}`);
        expect(response.status).toBe(401);
      });
      it('should fail to delete a post while not an admin', async () => {
        const post = PostStub();
        const user = UserStub();
        await dbConnection.collection('posts').insertOne(post);
        await dbConnection.collection('users').insertOne(user);
        const token = authService.signToken(user);
        const response = await request
          .delete(`/posts/${post.slug}`)
          .set('Cookie', `access_token=${token};`);
        expect(response.status).toBe(401);
      });
      it('should fail to delete a non-existent post', async () => {
        const user = UserStub(IUserRole.ADMIN);
        await dbConnection.collection('users').insertOne(user);
        const token = authService.signToken(user);
        const response = await request
          .delete(`/posts/eee`)
          .set('Cookie', `access_token=${token};`);
        expect(response.status).toBe(404);
      });
    });
    describe('delete a post', () => {
      it('should delete a post', async () => {
        const post = PostStub();
        const user = UserStub(IUserRole.ADMIN);
        await dbConnection.collection('posts').insertOne(post);
        await dbConnection.collection('users').insertOne(user);
        const token = authService.signToken(user);
        const response = await request
          .delete(`/posts/${post.slug}`)
          .set('Cookie', `access_token=${token};`);
        expect(response.status).toBe(200);
      });
    });

    afterEach(async () => {
      await clearDatabase(dbConnection, 'posts');
      await clearDatabase(dbConnection, 'users');
    });
  });

  afterAll(async () => {
    await clearDatabase(dbConnection, 'categories');
    await clearDatabase(dbConnection, 'posts');
    await clearDatabase(dbConnection, 'users');
    await app.close();
  });
});
