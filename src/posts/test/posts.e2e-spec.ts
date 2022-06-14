import { INestApplication } from '@nestjs/common';
import * as Mongoose from 'mongoose';
import { Connection } from 'mongoose';
import { initE2eWithGuards } from '../../shared/test/init.e2e';
import { clearDatabase } from '../../shared/test/utils';
import { CreatePostStub, mockedComment, PostStub } from './stub/post.stub';
import { doArraysIntersect } from '../../shared/utils/tests.utils';
import { urlRegex } from '../../shared/utils/regex.validation';
import { AuthService } from '../../auth/auth.service';
import { adminStub, UserStub } from '../../users/test/stub/user.stub';
import { IUserRole } from '../../users/entities/users.role.interface';
import { UpdatePostDto } from '../dto/update-post.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { CommentDto } from '../dto/comment.dto';
import { CommenterDto } from '../../users/dto/commenter.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { DeleteCommentDto } from '../dto/delete-comment.dto';
import { CategoryStub } from '../../categories/test/stub/category.stub';

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
        const post = CreatePostStub();
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
        const post = CreatePostStub();
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
        expect(response.body.hasMore).toBe(false);
        expect(response.body.posts).toBeInstanceOf(Array);
        expect(response.body.page).toBe(1);
        expect(response.body.posts.length).toBe(1);
        expect(
          doArraysIntersect(
            [...Object.keys(post), 'authUserLiked'],
            [...Object.keys(response.body.posts[0])],
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

  describe('update post', () => {
    describe('failing update post', () => {
      it('should not update a post while not logged in', async () => {
        const post = PostStub();
        const update: UpdatePostDto = { title: 'nouveau titre' };
        await dbConnection.collection('posts').insertOne(post);
        const response = await request
          .patch(`/posts/${post.slug}`)
          .send(update);
        expect(response.status).toBe(401);
      });
      it('should not update a post while not been admin', async () => {
        const post = PostStub();
        const user = UserStub();
        const update: UpdatePostDto = { title: 'nouveau titre' };
        await dbConnection.collection('users').insertOne(user);
        await dbConnection.collection('posts').insertOne(post);
        const token = authService.signToken(user);
        const response = await request
          .patch(`/posts/${post.slug}`)
          .send(update)
          .set('Cookie', `access_token=${token};`);
        expect(response.status).toBe(401);
      });
      it('should not update a non-existent post', async () => {
        const post = PostStub();
        const user = UserStub(IUserRole.ADMIN);
        const update: UpdatePostDto = { title: 'nouveau titre' };
        await dbConnection.collection('posts').insertOne(post);
        await dbConnection.collection('users').insertOne(user);
        const token = authService.signToken(user);
        const response = await request
          .patch(`/posts/eee`)
          .send(update)
          .set('Cookie', `access_token=${token};`);
        expect(response.status).toBe(404);
      });
      it('should not update a post which does not respect the validation rules', async () => {
        const post = PostStub();
        const user = UserStub(IUserRole.ADMIN);
        const update: UpdatePostDto = { title: '' };
        await dbConnection.collection('posts').insertOne(post);
        await dbConnection.collection('users').insertOne(user);
        const token = authService.signToken(user);
        const response = await request
          .patch(`/posts/eee`)
          .send(update)
          .set('Cookie', `access_token=${token};`);
        expect(response.status).toBe(400);
      });
    });

    describe('update post', () => {
      it('should update a post', async () => {
        const post = PostStub();
        const user = UserStub(IUserRole.ADMIN);
        const title = 'nouveau titre';
        const update: UpdatePostDto = { title };
        await dbConnection.collection('posts').insertOne(post);
        await dbConnection.collection('users').insertOne(user);
        const token = authService.signToken(user);
        const response = await request
          .patch(`/posts/${post.slug}`)
          .send(update)
          .set('Cookie', `access_token=${token};`);
        expect(response.status).toBe(200);
        expect(
          doArraysIntersect(Object.keys(response.body), [
            ...Object.keys(post),
            'authUserLike',
          ]),
        ).toBe(true);
        expect(response.body.title).toBe(title);
      });
    });

    afterEach(async () => {
      await clearDatabase(dbConnection, 'posts');
      await clearDatabase(dbConnection, 'users');
    });
  });

  describe('get liked posts', () => {
    describe('failing get liked posts', () => {
      it('should not get liked posts while not logged in', async () => {
        const user = UserStub();
        await dbConnection.collection('users').insertOne(user);
        const response = await request.get(`/posts/liked/${user._id}`);
        expect(response.status).toBe(401);
      });
      it('should not get liked posts of other user while not been admin', async () => {
        const user = UserStub();
        const userToQuery = adminStub();
        await dbConnection.collection('users').insertOne(user);
        await dbConnection.collection('users').insertOne(userToQuery);
        const token = authService.signToken(user);
        const response = await request
          .get(`/posts/liked/${userToQuery._id}`)
          .set('Cookie', `access_token=${token};`);
        expect(response.status).toBe(401);
      });
      it('should not get liked posts of a non-existent user', async () => {
        const user = UserStub(IUserRole.ADMIN);
        await dbConnection.collection('users').insertOne(user);
        const token = authService.signToken(user);
        const fakeId = new Mongoose.Types.ObjectId();
        const response = await request
          .get(`/posts/liked/${fakeId}`)
          .set('Cookie', `access_token=${token};`);
        expect(response.status).toBe(404);
      });
    });

    describe('get liked posts', () => {
      it('should get liked posts', async () => {
        const post = PostStub();
        const user = UserStub(IUserRole.ADMIN);
        await dbConnection
          .collection('posts')
          .insertOne({ ...post, likers: [user._id] });
        await dbConnection.collection('users').insertOne(user);
        const token = authService.signToken(user);
        const response = await request
          .get(`/posts/liked/${user._id}`)
          .set('Cookie', `access_token=${token};`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0]).toMatchObject({
          title: post.title,
          desc: post.desc,
          slug: post.slug,
        });
      });
    });

    afterEach(async () => {
      await clearDatabase(dbConnection, 'posts');
      await clearDatabase(dbConnection, 'users');
    });
  });

  describe('Comment a post', function () {
    describe('Failing', function () {
      it('should not comment while not logged in', async function () {
        const post = PostStub();
        await dbConnection.collection('posts').insertOne(post);
        const response = await request
          .post(`/posts/comment/${post.slug}`)
          .send({
            comment: 'un commentaire',
          } as CreateCommentDto);
        expect(response.status).toBe(401);
      });

      it('should not comment a non-existant post', async function () {
        const user = UserStub();
        await dbConnection.collection('users').insertOne(user);
        const token = authService.signToken(user);
        const response = await request
          .post(`/posts/comment/aerzzae`)
          .send({
            comment: 'un commentaire',
          } as CreateCommentDto)
          .set('Cookie', `access_token=${token}`);
        expect(response.status).toBe(404);
      });

      it('should not comment with bad validations', async function () {
        const user = UserStub();
        const post = PostStub();
        await dbConnection.collection('users').insertOne(user);
        const token = authService.signToken(user);
        const response = await request
          .post(`/posts/comment/${post.slug}`)
          .send({
            comment: '',
          } as CreateCommentDto)
          .set('Cookie', `access_token=${token}`);
        expect(response.status).toBe(400);
      });
    });

    describe('Successfully', function () {
      it('should comment a post', async function () {
        const post = PostStub();
        const user = UserStub();
        await dbConnection.collection('users').insertOne(user);
        await dbConnection.collection('posts').insertOne(post);
        const token = authService.signToken(user);
        const response = await request
          .post(`/posts/comment/${post.slug}`)
          .send({
            comment: 'un commentaire',
          } as CreateCommentDto)
          .set('Cookie', `access_token=${token}`);
        expect(response.status).toBe(201);
        expect(response.body.comments).toBeInstanceOf(Array);
        expect(response.body.comments.length).toBe(1);
        const { _id, comment, commenter, updatedAt, createdAt } = response.body
          .comments[0] as CommentDto;
        const { picture, pseudo } = commenter as CommenterDto;
        expect(comment).toBe('un commentaire');
        expect(updatedAt).not.toBeDefined();
        expect([pseudo, picture]).toEqual([user.pseudo, user.picture]);
      });
    });

    afterEach(async () => {
      await clearDatabase(dbConnection, 'posts');
      await clearDatabase(dbConnection, 'users');
    });
  });

  describe('Update comment', function () {
    describe('Failing', function () {
      it('should not update comment while not logged in', async function () {
        const post = PostStub();
        await dbConnection.collection('posts').insertOne(post);
        const response = await request
          .patch(`/posts/comment/${post.slug}`)
          .send({
            comment: 'un commentaire',
            _id: new Mongoose.Types.ObjectId(),
            commenterId: new Mongoose.Types.ObjectId(),
          } as UpdateCommentDto);
        expect(response.status).toBe(401);
      });
      it('should not update comment on a non-existant post', async function () {
        const user = UserStub();
        await dbConnection.collection('users').insertOne(user);
        const token = authService.signToken(user);
        const response = await request
          .patch(`/posts/comment/aerzzae`)
          .send({
            comment: 'un commentaire',
            _id: new Mongoose.Types.ObjectId(),
            commenterId: user._id,
          } as UpdateCommentDto)
          .set('Cookie', `access_token=${token}`);
        expect(response.status).toBe(404);
      });
      it('should not update comment with bad validations', async function () {
        const user = UserStub();
        const post = PostStub();
        await dbConnection.collection('users').insertOne(user);
        const token = authService.signToken(user);
        const response = await request
          .patch(`/posts/comment/${post.slug}`)
          .send({
            comment: '',
            _id: new Mongoose.Types.ObjectId(),
            commenterId: new Mongoose.Types.ObjectId(),
          } as CreateCommentDto)
          .set('Cookie', `access_token=${token}`);
        expect(response.status).toBe(400);
      });
      it('should not update a comment that not belong to the logged in user', async function () {
        const commenter = adminStub();
        const updaterId = new Mongoose.Types.ObjectId();
        const updater = UserStub(IUserRole.USER, updaterId);
        const post = PostStub();
        const comment: CommentDto = {
          ...mockedComment(),
          commenter: {
            _id: commenter._id,
            pseudo: commenter.pseudo,
          },
        };
        post.comments.push(comment);
        await dbConnection.collection('posts').insertOne(post);
        await dbConnection.collection('users').insertMany([commenter, updater]);
        const token = authService.signToken(updater);
        const response = await request
          .patch(`/posts/comment/${post.slug}`)
          .set('Cookie', `access_token=${token}`)
          .send({
            comment: 'heyhey',
            _id: post.comments[0]._id,
            commenterId: commenter._id,
          } as UpdateCommentDto);
        expect(response.status).toBe(401);
      });
    });

    describe('Successfully', function () {
      it("should update the logged in user's comment", async function () {
        const commenter = adminStub();
        const post = PostStub();
        const comment: CommentDto = {
          ...mockedComment(),
          commenter: {
            _id: commenter._id,
            pseudo: commenter.pseudo,
          },
        };
        post.comments.push(comment);
        await dbConnection.collection('posts').insertOne(post);
        await dbConnection.collection('users').insertOne(commenter);
        const token = authService.signToken(commenter);
        const response = await request
          .patch(`/posts/comment/${post.slug}`)
          .set('Cookie', `access_token=${token}`)
          .send({
            comment: 'heyhey',
            _id: post.comments[0]._id,
            commenterId: commenter._id,
          } as UpdateCommentDto);
        expect(response.status).toBe(200);
        expect(response.body.comments[0].comment).toBe('heyhey');
        expect(response.body.comments[0].updatedAt).toBeDefined();
      });
      it('should update a comment that not belong to the logged in admin user', async function () {
        const commenter = UserStub();
        const post = PostStub();
        const updater = adminStub();
        const comment: CommentDto = {
          ...mockedComment(),
          commenter: {
            _id: commenter._id,
            pseudo: commenter.pseudo,
          },
        };
        post.comments.push(comment);
        await dbConnection.collection('posts').insertOne(post);
        await dbConnection.collection('users').insertMany([commenter, updater]);
        const token = authService.signToken(updater);
        const response = await request
          .patch(`/posts/comment/${post.slug}`)
          .set('Cookie', `access_token=${token}`)
          .send({
            comment: 'heyhey',
            _id: post.comments[0]._id,
            commenterId: commenter._id,
          } as UpdateCommentDto);
        expect(response.status).toBe(200);
      });
    });

    afterEach(async () => {
      await clearDatabase(dbConnection, 'posts');
      await clearDatabase(dbConnection, 'users');
    });
  });

  describe('Delete comment', function () {
    describe('Failing', function () {
      it('should not delete a comment while not logged in', async function () {
        const response = await request
          .delete(`/posts/comment/slug`)
          .send({} as DeleteCommentDto);
        expect(response.status).toBe(401);
      });
      it('should not delete a comment on a non-existent post', async function () {
        const user = UserStub();
        await dbConnection.collection('users').insertOne(user);
        const token = authService.signToken(user);
        const response = await request
          .delete(`/posts/comment/slug`)
          .set('Cookie', `access_token=${token}`)
          .send({
            _id: new Mongoose.Types.ObjectId(),
            commenterId: user._id,
          } as DeleteCommentDto);
        expect(response.status).toBe(404);
      });
      it('should not delete a comment that does not belong to the logged user', async function () {
        const user = UserStub();
        const post = PostStub();
        await dbConnection.collection('users').insertOne(user);
        await dbConnection.collection('posts').insertOne(post);
        const token = authService.signToken(user);
        const response = await request
          .delete(`/posts/comment/${post.slug}`)
          .set('Cookie', `access_token=${token}`)
          .send({
            _id: new Mongoose.Types.ObjectId(),
            commenterId: new Mongoose.Types.ObjectId(),
          } as DeleteCommentDto);
        expect(response.status).toBe(401);
      });
    });
    describe('Successfully', function () {
      it('should delete a comment', async function () {
        const commenter = adminStub();
        const post = PostStub();
        const comment: CommentDto = {
          ...mockedComment(),
          commenter: {
            _id: commenter._id,
            pseudo: commenter.pseudo,
          },
        };
        post.comments.push(comment);
        await dbConnection.collection('posts').insertOne(post);
        await dbConnection.collection('users').insertOne(commenter);
        const token = authService.signToken(commenter);
        const response = await request
          .delete(`/posts/comment/${post.slug}`)
          .set('Cookie', `access_token=${token}`)
          .send({
            _id: post.comments[0]._id,
            commenterId: commenter._id,
          } as DeleteCommentDto);
        expect(response.status).toBe(200);
        expect(response.body.comments.length).toBe(0);
      });
      it('should delete a comment that does not belong to the logged admin user', async function () {
        const commenter = UserStub();
        const post = PostStub();
        const updater = adminStub();
        const comment: CommentDto = {
          ...mockedComment(),
          commenter: {
            _id: commenter._id,
            pseudo: commenter.pseudo,
          },
        };
        post.comments.push(comment);
        await dbConnection.collection('posts').insertOne(post);
        await dbConnection.collection('users').insertMany([commenter, updater]);
        const token = authService.signToken(updater);
        const response = await request
          .delete(`/posts/comment/${post.slug}`)
          .set('Cookie', `access_token=${token}`)
          .send({
            _id: post.comments[0]._id,
            commenterId: commenter._id,
          } as DeleteCommentDto);
        expect(response.status).toBe(200);
      });
    });
    afterEach(async () => {
      await clearDatabase(dbConnection, 'posts');
      await clearDatabase(dbConnection, 'users');
    });
  });

  describe('Get categorized posts', function () {
    it('should return an empty array if the category does not exist', async function () {
      const post = PostStub();
      const category = CategoryStub();
      await dbConnection.collection('posts').insertOne(post);
      const response = await request.get(`/posts/categorized/${category.name}`);
      expect(response.body).toEqual([]);
    });
    it('should return posts related to the category', async function () {
      const category = CategoryStub();
      const post = {
        ...PostStub(),
        categories: [category._id],
      };
      await dbConnection.collection('categories').insertOne(category);
      await dbConnection.collection('posts').insertOne(post);
      const response = await request.get(`/posts/categorized/${category.name}`);
      expect(response.body.length).toBe(1);
    });

    afterEach(async () => {
      await clearDatabase(dbConnection, 'posts');
      await clearDatabase(dbConnection, 'categories');
    });
  });

  afterAll(async () => {
    await clearDatabase(dbConnection, 'categories');
    await clearDatabase(dbConnection, 'posts');
    await clearDatabase(dbConnection, 'users');
    await dbConnection.close();
    await app.close();
  });
});
