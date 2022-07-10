'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
      return Reflect.metadata(k, v);
  };
var __param =
  (this && this.__param) ||
  function (paramIndex, decorator) {
    return function (target, key) {
      decorator(target, key, paramIndex);
    };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.UsersService = void 0;
const common_1 = require('@nestjs/common');
const mongoose_1 = require('@nestjs/mongoose');
const user_entity_1 = require('./entities/user.entity');
const Mongoose = require('mongoose');
const mongoose_2 = require('mongoose');
const HttpError_1 = require('../shared/error/HttpError');
const users_role_interface_1 = require('./entities/users.role.interface');
const google_service_1 = require('../cloud/google.service');
const upload_types_1 = require('../shared/types/upload.types');
const mail_service_1 = require('../mail/mail.service');
const password_utils_1 = require('../shared/utils/password.utils');
const posts_service_1 = require('../posts/posts.service');
let UsersService = class UsersService {
  constructor(userModel, googleService, mailService, postsService) {
    this.userModel = userModel;
    this.googleService = googleService;
    this.mailService = mailService;
    this.postsService = postsService;
  }
  async create(createUserDto) {
    if (await this.getUserByEmail(createUserDto.email)) {
      throw new common_1.ConflictException(
        HttpError_1.HttpError.getHttpError(
          HttpError_1.HttpErrorCode.USER_ALREADY_EXIST,
        ),
      );
    }
    if (await this.getUserByPseudo(createUserDto.pseudo)) {
      throw new common_1.ConflictException(
        HttpError_1.HttpError.getHttpError(
          HttpError_1.HttpErrorCode.USER_ALREADY_EXIST,
        ),
      );
    }
    const createdUser = await this.userModel.create(createUserDto);
    return this.asDtoWithoutPassword(createdUser);
  }
  async getUsers() {
    const users = await this.find();
    return users.map((u) => this.asDtoWithoutPassword(u));
  }
  async getUserByEmail(email) {
    const user = await this.findOne({ email });
    return user ? this.asDtoWithoutPassword(user) : null;
  }
  async getUserById(id) {
    const user = await this.findOne({ _id: id });
    if (!user)
      throw new common_1.NotFoundException(
        HttpError_1.HttpError.getHttpError(
          HttpError_1.HttpErrorCode.USER_NOT_FOUND,
        ),
      );
    return this.asDtoWithoutPassword(user);
  }
  async getUserByPseudo(pseudo) {
    const user = await this.findOne({ pseudo });
    return user ? this.asDtoWithoutPassword(user) : null;
  }
  async update(id, updateUserDto, user) {
    await this.getUserById(id);
    this.isSelfOrAdmin(id, user);
    if (
      updateUserDto.pseudo &&
      (await this.getUserByPseudo(updateUserDto.pseudo))
    ) {
      throw new common_1.ConflictException(
        HttpError_1.HttpError.getHttpError(
          HttpError_1.HttpErrorCode.DUPLICATE_PSEUDO,
        ),
      );
    }
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: id },
      Object.assign({}, updateUserDto),
      {
        new: true,
      },
    );
    return this.asDtoWithoutPassword(updatedUser);
  }
  async uploadProfilePicture(id, file, user) {
    await this.getUserById(id);
    this.isSelfOrAdmin(id, user);
    const url = await this.googleService.uploadFile(
      file,
      id,
      upload_types_1.UploadTypes.USER,
    );
    await this.userModel.findOneAndUpdate(
      { _id: id },
      {
        picture: url,
      },
    );
    return { picture: url };
  }
  async removeProfilePicture(id, user) {
    await this.getUserById(id);
    this.isSelfOrAdmin(id, user);
    await this.googleService.deleteFile(id, upload_types_1.UploadTypes.USER);
    await this.userModel.findOneAndUpdate(
      { _id: id },
      {
        $unset: {
          picture: 1,
        },
      },
    );
  }
  isSelfOrAdmin(id, user) {
    if (
      !(
        id === user._id.toString() ||
        user.role === users_role_interface_1.IUserRole.ADMIN
      )
    ) {
      throw new common_1.UnauthorizedException(
        HttpError_1.HttpError.getHttpError(
          HttpError_1.HttpErrorCode.ROLE_UNAUTHORIZED,
        ),
      );
    }
  }
  async deleteUser(id, authUser) {
    await this.getUserById(id);
    this.isSelfOrAdmin(id, authUser);
    const likedPosts = await this.postsService.getLikedPosts(id, authUser);
    for (const likedPost of likedPosts) {
      await this.postsService.unlikePost(likedPost.slug, authUser);
    }
    const commentedPosts = await this.postsService.getCommentedPosts(
      id,
      authUser,
    );
    for (const commentedPost of commentedPosts) {
      const comments = commentedPost.comments.filter(
        (comment) => comment.commenter._id.toString() === id,
      );
      for (const comment of comments) {
        await this.postsService.deletePostComment(
          authUser,
          commentedPost.slug,
          {
            commenterId: new Mongoose.Types.ObjectId(id),
            _id: comment._id,
          },
        );
      }
    }
    await this.userModel.findOneAndDelete({ _id: id });
  }
  async sendPasswordRecovery(email, locale) {
    if (!(await this.getUserByEmail(email))) return;
    const token = (0, password_utils_1.uuid)();
    const user = await this.userModel.findOneAndUpdate(
      { email },
      {
        recoveryToken: token,
      },
    );
    await this.mailService.addPasswordRecoveryEmailToQueue({
      mailTo: user.email,
      pseudo: user.pseudo,
      token,
      locale,
    });
  }
  async recoverPassword(token, body) {
    if (!(await this.findOne({ recoveryToken: token }))) {
      throw new common_1.NotFoundException();
    }
    await this.userModel.findOneAndUpdate(
      { recoveryToken: token },
      {
        password: body.password,
        $unset: { recoveryToken: 1 },
      },
    );
  }
  async save(user) {
    await this.userModel.replaceOne({ _id: user._id }, user, { upsert: true });
  }
  async find(match = {}) {
    if (match._id) {
      if (!(0, mongoose_2.isValidObjectId)(match._id)) {
        throw new common_1.BadRequestException();
      } else {
        match._id = new mongoose_2.Types.ObjectId(match._id);
      }
    }
    return this.userModel.find(match, {
      _id: 1,
      password: 1,
      pseudo: 1,
      email: 1,
      role: 1,
      createdAt: 1,
      updatedAt: 1,
      picture: 1,
    });
  }
  async findOne(match) {
    const users = await this.find(match);
    if (users.length > 0) {
      return users[0];
    } else {
      return null;
    }
  }
  asDto(user) {
    return {
      _id: user._id,
      pseudo: user.pseudo,
      email: user.email,
      password: user.password,
      role: user.role,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
    };
  }
  asDtoWithoutPassword(user) {
    return {
      _id: user._id,
      pseudo: user.pseudo,
      email: user.email,
      role: user.role,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
      picture: user.picture,
    };
  }
};
UsersService = __decorate(
  [
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_entity_1.User.name)),
    __param(
      3,
      (0, common_1.Inject)(
        (0, common_1.forwardRef)(() => posts_service_1.PostsService),
      ),
    ),
    __metadata('design:paramtypes', [
      mongoose_2.Model,
      google_service_1.GoogleService,
      mail_service_1.MailService,
      posts_service_1.PostsService,
    ]),
  ],
  UsersService,
);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map
