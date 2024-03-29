import { INestApplication } from '@nestjs/common';
import * as Mongoose from 'mongoose';
import { Connection } from 'mongoose';
import * as bcrypt from 'bcrypt';
import {
  adminStub,
  mockDate,
  UserStub,
  UserStubWithoutPasswordAndDates,
} from './stub/user.stub';
import { clearDatabase } from '../../shared/test/utils';
import { initE2eWithGuards } from '../../shared/test/init.e2e';
import { AuthService } from '../../auth/auth.service';
import { IUserRole } from '../entities/users.role.interface';
import { PostsService } from '../../posts/posts.service';
import { PostStub } from '../../posts/test/stub/post.stub';
import { User } from '../entities/user.entity';
import { PostDto } from '../../posts/dto/post.dto';

describe('UsersController (e2e)', () => {
  let dbConnection: Connection;
  let app: INestApplication;
  let request;
  let authService: AuthService;
  let postsService: PostsService;

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
    postsService = moduleFixture.get<PostsService>(PostsService);
    authService = moduleFixture.get<AuthService>(AuthService);
  });

  describe('getUsers not logged in', () => {
    afterEach(async () => {
      await clearDatabase(dbConnection, 'users');
    });

    it('should not return an array of users', async () => {
      await dbConnection.collection('users').insertOne(UserStub());
      const response = await request.get('/users');
      expect(response.status).toBe(401);
    });
  });

  describe('getUsers logged in', () => {
    afterEach(async () => {
      await clearDatabase(dbConnection, 'users');
    });
    it('should return an array of users', async () => {
      const user = UserStub();
      const authUser = adminStub();
      await dbConnection.collection('users').insertMany([user, authUser]);
      const token = authService.signToken(authUser);
      const response = await request
        .get('/users')
        .set('Cookie', `access_token=${token};`);
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toEqual(
        expect.objectContaining({
          _id: expect.any(String),
          pseudo: expect.any(String),
          email: expect.any(String),
          role: expect.any(String),
          updatedAt: expect.any(String),
          createdAt: expect.any(String),
        }),
      );
    });
    it('should not return an array of users if auth user is not admin', async () => {
      const user = UserStub();
      const mockId = new Mongoose.Types.ObjectId();
      const authUser = {
        email: 'blabla@doe.fr',
        _id: mockId,
        password: 'password',
        pseudo: 'john doe blabla',
        role: IUserRole.USER,
        createdAt: mockDate,
        updatedAt: mockDate,
      };
      await dbConnection.collection('users').insertMany([user, authUser]);
      const token = authService.signToken(authUser);
      const response = await request
        .get('/users')
        .set('Cookie', `access_token=${token};`);
      expect(response.status).toBe(401);
    });
  });

  describe('createUsers', () => {
    afterEach(async () => {
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
    it('should not create a user with already used email', async function () {
      await dbConnection.collection('users').insertOne(UserStub());
      const response = await request.post('/users').send({
        password: UserStub().password,
        pseudo: 'autre pseudo',
        email: UserStub().email,
      });
      expect(response.status).toBe(409);
    });
    it('should not create a user with already used pseudo', async function () {
      await dbConnection.collection('users').insertOne(UserStub());
      const response = await request.post('/users').send({
        password: UserStub().password,
        pseudo: UserStub().pseudo,
        email: 'autre@mail.fr',
      });
      expect(response.status).toBe(409);
    });
    it('should create a user', async () => {
      const response = await request.post('/users').send({
        password: UserStub().password,
        pseudo: UserStub().pseudo,
        email: UserStub().email,
      });
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(UserStubWithoutPasswordAndDates());
    });
  });

  describe('get User by id', () => {
    describe('failing get user not logged in', () => {
      it('should not get a user with invalid id', async () => {
        const response = await request.get('/users/eee');
        expect(response.status).toBe(401);
      });
      it('should not return a user that does not exist', async () => {
        const mockObjectId = new Mongoose.Types.ObjectId();
        const response = await request.get(`/users/${mockObjectId}`);
        expect(response.status).toBe(401);
      });
    });
    describe('failing get user logged in', () => {
      let token;
      beforeAll(async () => {
        await clearDatabase(dbConnection, 'users');
        const authUser = adminStub();
        await dbConnection.collection('users').insertOne(authUser);
        token = authService.signToken(authUser);
      });
      it('should not get a user with invalid id', async () => {
        const response = await request
          .get('/users/eee')
          .set('Cookie', `access_token=${token};`);
        expect(response.status).toBe(400);
      });
      it('should not return a user that does not exist', async () => {
        const mockObjectId = new Mongoose.Types.ObjectId();
        const response = await request
          .get(`/users/${mockObjectId}`)
          .set('Cookie', `access_token=${token};`);
        expect(response.status).toBe(404);
      });
    });
  });

  describe('update user', () => {
    describe('failing update user', () => {
      it('should not update a user while not logged in', async () => {
        const user = UserStub();
        await dbConnection.collection('users').insertOne(user);
        const response = await request.patch(`/users/${user._id}`);
        expect(response.status).toBe(401);
      });
      it('should not update a non-existent user', async () => {
        const user = UserStub();
        const token = authService.signToken(user);
        const fakeId = new Mongoose.Types.ObjectId();
        await dbConnection.collection('users').insertOne(user);
        const response = await request
          .patch(`/users/${fakeId}`)
          .set('Cookie', `access_token=${token}`);
        expect(response.status).toBe(404);
      });
      it('should not update a user who is not self while not been admin', async () => {
        const user = UserStub();
        const userToUpdate = adminStub();
        const token = authService.signToken(user);
        await dbConnection.collection('users').insertOne(user);
        await dbConnection.collection('users').insertOne(userToUpdate);
        const response = await request
          .patch(`/users/${userToUpdate._id}`)
          .set('Cookie', `access_token=${token}`);
        expect(response.status).toBe(401);
      });
      it('should not update a user which does not respect the validation rules', async () => {
        const user = UserStub();
        const token = authService.signToken(user);
        await dbConnection.collection('users').insertOne(user);
        const response = await request
          .patch(`/users/${user._id}`)
          .send({ pseudo: 'e' })
          .set('Cookie', `access_token=${token}`);
        expect(response.status).toBe(400);
      });
      it('should not update a user with a pseudo already used', async () => {
        const user = UserStub();
        const userToUpdate = adminStub();
        const token = authService.signToken(user);
        await dbConnection.collection('users').insertOne(user);
        await dbConnection.collection('users').insertOne(userToUpdate);
        const response = await request
          .patch(`/users/${user._id}`)
          .send({ pseudo: userToUpdate.pseudo })
          .set('Cookie', `access_token=${token}`);
        expect(response.status).toBe(409);
      });
      it('should not update role while user is not admin', async function () {
        const user = UserStub();
        await dbConnection.collection('users').insertOne(user);
        const token = authService.signToken(user);
        const response = await request
          .patch(`/users/${user._id}`)
          .set('Cookie', `access_token=${token}`)
          .send({ role: '2' });
        expect(response.status).toBe(401);
      });
    });
    describe('update user', () => {
      it('should update a user and return the new user', async () => {
        const user = UserStub();
        await dbConnection.collection('users').insertOne(user);
        const token = authService.signToken(user);
        const response = await request
          .patch(`/users/${user._id}`)
          .set('Cookie', `access_token=${token}`)
          .send({ pseudo: 'nouveau pseudo' });
        expect(response.status).toBe(200);
        expect(response.body.pseudo).toBe('nouveau pseudo');
      });
    });
    afterEach(async () => {
      await clearDatabase(dbConnection, 'users');
    });
  });

  describe('delete user', () => {
    describe('failing delete user', () => {
      it('should not delete a user while not logged in', async () => {
        const user = UserStub();
        await dbConnection.collection('users').insertOne(user);
        const response = await request.delete(`/users/${user._id}`);
        expect(response.status).toBe(401);
      });
      it('should not delete a non-existent user', async () => {
        const user = UserStub();
        const fakeId = new Mongoose.Types.ObjectId();
        await dbConnection.collection('users').insertOne(user);
        const token = authService.signToken(user);
        const response = await request
          .delete(`/users/${fakeId}`)
          .set('Cookie', `access_token=${token}`);
        expect(response.status).toBe(404);
      });
      it('should not delete a user who is not self while not been admin', async () => {
        const user = UserStub();
        const userToDelete = adminStub();
        await dbConnection.collection('users').insertOne(user);
        await dbConnection.collection('users').insertOne(userToDelete);
        const token = authService.signToken(user);
        const response = await request
          .delete(`/users/${userToDelete._id}`)
          .set('Cookie', `access_token=${token}`);
        expect(response.status).toBe(401);
      });
    });
    describe('delete user', () => {
      it('should delete cascade a user', async () => {
        const user = UserStub();
        const post = PostStub();
        await dbConnection.collection('users').insertOne(user);
        await dbConnection.collection('posts').insertOne(post);
        const token = authService.signToken(user);
        await postsService.commentPost(
          user as User,
          {
            comment: 'un commentaire',
          },
          post.slug,
        );
        await postsService.likePost(post.slug, user as User);
        const response = await request
          .delete(`/users/${user._id}`)
          .set('Cookie', `access_token=${token}`);
        expect(response.status).toBe(200);
        const founded = await dbConnection
          .collection('users')
          .findOne({ _id: user._id });
        expect(founded).toBeNull();
        const queriedPost = (await dbConnection
          .collection('posts')
          .findOne({ slug: post.slug })) as PostDto;
        expect(queriedPost.comments).toEqual([]);
        expect(queriedPost.likes).toBe(0);
      });
    });
    afterEach(async () => {
      await clearDatabase(dbConnection, 'users');
      await clearDatabase(dbConnection, 'posts');
    });
  });

  describe('recovery password system', () => {
    let token;
    it('should set a recovery token to the user', async () => {
      const user = UserStub();
      await dbConnection.collection('users').insertOne(user);
      const response = await request
        .post('/users/password')
        .send({ email: user.email, locale: 'fr' });
      expect(response.status).toBe(200);
      const insertedUser = await dbConnection
        .collection('users')
        .findOne({ email: user.email });
      token = insertedUser.recoveryToken;
      expect(token).toMatch(new RegExp(/[\w]{8}(-[\w]{4}){3}-[\w]{12}/gm));
    });

    it("should not change a non-existent user's password", async () => {
      const response = await request
        .post('/users/password/zeraer')
        .send({ password: 'newpassword' });
      expect(response.status).toBe(404);
    });
    it('should not change password with a too short one', async () => {
      const response = await request
        .post('/users/password/zeraer')
        .send({ password: 'ee' });
      expect(response.status).toBe(400);
    });

    it("should change the user's password", async () => {
      const password = 'newpassword';
      const beforeUser = await dbConnection
        .collection('users')
        .findOne({ recoveryToken: token });
      const response = await request
        .post(`/users/password/${token}`)
        .send({ password });

      const afterUser = await dbConnection
        .collection('users')
        .findOne({ email: beforeUser.email });
      expect(response.status).toBe(200);
      expect(await bcrypt.compare(password, afterUser.password)).toBe(true);
    });
    afterAll(async () => {
      await clearDatabase(dbConnection, 'users');
    });
  });

  describe('Password change', function () {
    describe('Failings', function () {
      it('should not change password with missing fields', async function () {
        const user = UserStub();
        await dbConnection.collection('users').insertOne(user);
        const token = authService.signToken(user);
        const response_1 = await request
          .patch(`/users/${user._id}`)
          .set('Cookie', `access_token=${token}`)
          .send({ password: 'new_password' });
        expect(response_1.status).toBe(400);
        const response_2 = await request
          .patch(`/users/${user._id}`)
          .set('Cookie', `access_token=${token}`)
          .send({ currentPassword: 'current_password' });
        expect(response_2.status).toBe(400);
      });

      it('should not change password with wrong current password', async function () {
        const user = UserStub();
        await dbConnection.collection('users').insertOne(user);
        const token = authService.signToken(user);
        const response = await request
          .patch(`/users/${user._id}`)
          .set('Cookie', `access_token=${token}`)
          .send({
            password: 'new_password',
            currentPassword: 'wrong_password',
          });
        expect(response.status).toBe(400);
      });
    });

    describe('Successfully', function () {
      it('should change user password', async function () {
        const createdUserResponse = await request.post('/users').send({
          password: UserStub().password,
          pseudo: UserStub().pseudo,
          email: UserStub().email,
        });
        const logResponse = await request.post('/auth/login').send({
          email: UserStub().email,
          password: UserStub().password,
        });
        const token = logResponse.headers['set-cookie'][0].replace(
          'access_token=',
          '',
        );
        const response = await request
          .patch(`/users/${createdUserResponse.body._id}`)
          .set('Cookie', `access_token=${token}`)
          .send({
            password: 'new_password',
            currentPassword: 'password',
          });
        expect(response.status).toBe(200);
      });
    });

    afterEach(async () => {
      await clearDatabase(dbConnection, 'users');
    });
  });

  describe('getCommentsByUserId', function () {
    describe('failings', function () {
      it('should not fetch while unAuth', async function () {
        const response = await request.get('/users/id/comments');
        expect(response.status).toBe(401);
      });

      it('should not fetch while not admin', async function () {
        const user = UserStub();
        await dbConnection.collection('users').insertOne(user);
        const token = authService.signToken(user);
        const response = await request
          .get(`/users/${user._id}/comments`)
          .set('Cookie', `access_token=${token}`);
        expect(response.status).toBe(401);
      });

      it('should not fetch if user not found', async function () {
        const user = UserStub(IUserRole.ADMIN);
        const id = new Mongoose.Types.ObjectId();
        await dbConnection.collection('users').insertOne(user);
        const token = authService.signToken(user);
        const response = await request
          .get(`/users/${id}/comments`)
          .set('Cookie', `access_token=${token}`);
        expect(response.status).toBe(404);
      });
    });

    describe('successfully', function () {
      it('should fetch the commented posts', async function () {
        const user = UserStub(IUserRole.ADMIN);
        const post = {
          ...PostStub(),
          comments: [
            {
              commenter: user._id,
              _id: new Mongoose.Types.ObjectId(),
              comment: 'comment',
              createdAt: 1,
            },
          ],
        };
        await dbConnection.collection('users').insertOne(user);
        await dbConnection.collection('posts').insertOne(post);
        const token = authService.signToken(user);
        const response = await request
          .get(`/users/${user._id}/comments`)
          .set('Cookie', `access_token=${token}`);
        expect(response.body.length).toBe(1);
      });
    });

    afterEach(async () => {
      await clearDatabase(dbConnection, 'users');
      await clearDatabase(dbConnection, 'posts');
    });
  });

  afterAll(async () => {
    await clearDatabase(dbConnection, 'users');
    await dbConnection.close(true);
    await app.close();
  });
});
