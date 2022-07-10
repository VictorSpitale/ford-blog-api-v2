import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './entities/post.entity';
import * as Mongoose from 'mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { MatchType } from '../shared/types/match.types';
import { PostDto } from './dto/post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '../users/entities/user.entity';
import { GoogleService } from '../cloud/google.service';
import { UploadTypes } from '../shared/types/upload.types';
import { LikeOperation } from '../shared/types/post.types';
import { HttpError, HttpErrorCode } from '../shared/error/HttpError';
import { UpdatePostDto } from './dto/update-post.dto';
import { UsersService } from '../users/users.service';
import { BasicPostDto } from './dto/basic-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { DeleteCommentDto } from './dto/delete-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CategoriesService } from '../categories/categories.service';
import * as _ from 'lodash';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    private readonly googleService: GoogleService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => CategoriesService))
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    file: Express.Multer.File,
  ): Promise<PostDto | any> {
    if (await this.checkIfPostIsDuplicatedBySlug(createPostDto.slug)) {
      throw new ConflictException(
        HttpError.getHttpError(HttpErrorCode.DUPLICATE_SLUG),
      );
    }
    let data = { ...createPostDto } as any;
    if (file) {
      const picturePath = await this.googleService.uploadFile(
        file,
        createPostDto.slug,
        UploadTypes.POST,
      );
      data = { ...data, picture: picturePath };
    }
    const createdPost = await this.postModel.create(data);
    await createdPost.populate('categories');
    return this.asDto(createdPost, null);
  }

  async likePost(slug, user): Promise<number> {
    return this.updateLikeStatus(slug, user, LikeOperation.LIKE);
  }

  async unlikePost(slug, user): Promise<number> {
    return this.updateLikeStatus(slug, user, LikeOperation.UNLIKE);
  }

  private async updateLikeStatus(
    slug: string,
    user: User,
    operation: LikeOperation,
  ): Promise<number> {
    if (!(await this.postModel.findOne({ slug }))) {
      throw new NotFoundException(
        HttpError.getHttpError(HttpErrorCode.POST_NOT_FOUND),
      );
    }
    const updated = await this.postModel
      .findOneAndUpdate(
        { slug },
        { [operation]: { likers: user._id } },
        { new: true },
      )
      .populate('likers');
    return this.asDto(updated, user).likes;
  }

  async deletePost(slug: string, user: User) {
    await this.getPost(slug, user);
    await this.postModel.findOneAndDelete({ slug });
    await this.googleService.deleteFile(slug, UploadTypes.POST);
  }

  async updatePost(
    slug: string,
    updatePostDto: UpdatePostDto,
    user: User,
  ): Promise<PostDto> {
    await this.getPost(slug, user);
    const updated = await this.postModel
      .findOneAndUpdate({ slug }, { ...updatePostDto }, { new: true })
      .populate('categories likers')
      .populate('comments.commenter', ['pseudo', 'picture']);
    return this.asDto(updated, user);
  }

  async getPosts(
    user: User,
    page: number,
  ): Promise<{ hasMore: boolean; posts: PostDto[]; page: number }> {
    let posts;
    let hasMore = false;
    if (!page) posts = await this.find({});
    else {
      if (page <= 0) page = 1;
      posts = await this.postModel
        .find({})
        .sort({ createdAt: -1 })
        .limit(4)
        .populate('categories')
        .skip(3 * (page - 1));
      if (posts.length > 3) {
        hasMore = true;
      }
      posts = posts.slice(0, 3);
    }
    return {
      hasMore,
      posts: posts.map((p) => this.asDto(p, user)),
      page: page || 1,
    };
  }

  async getLastPosts(user: User): Promise<PostDto[]> {
    const posts = await this.find({}, 6);
    return posts.map((p) => this.asDto(p, user));
  }

  async getPost(slug: string, user: User): Promise<PostDto> {
    const post = await this.findOne({ slug });
    if (!post) {
      throw new NotFoundException(
        HttpError.getHttpError(HttpErrorCode.POST_NOT_FOUND),
      );
    }
    return this.asDto(post, user);
  }

  async getLikedPosts(userId: string, authUser: User): Promise<BasicPostDto[]> {
    await this.usersService.getUserById(userId);
    this.usersService.isSelfOrAdmin(userId, authUser);
    const posts = await this.postModel.find({ likers: userId });
    return posts.map((p) => this.asBasicDto(p));
  }

  async getCommentedPosts(userId: string, authUser: User): Promise<PostDto[]> {
    await this.usersService.getUserById(userId);
    this.usersService.isSelfOrAdmin(userId, authUser);
    const posts = await this.postModel.find({
      comments: { $elemMatch: { commenter: userId } },
    });
    return posts.map((p) => this.asDto(p));
  }

  async getQueriedPosts(search: string | string[]): Promise<BasicPostDto[]> {
    if (
      !search ||
      typeof search !== 'string' ||
      (search && search.length < 3)
    ) {
      throw new BadRequestException(
        HttpError.getHttpError(HttpErrorCode.SEARCH_QUERY),
      );
    }

    const query = _.escapeRegExp(search);
    const searchReg = new RegExp('.*' + query + '.*', 'i');
    const posts = await this.find(
      {
        $or: [
          {
            title: {
              $regex: searchReg,
            },
          },
          {
            desc: {
              $regex: searchReg,
            },
          },
          {
            slug: {
              $regex: searchReg,
            },
          },
        ],
      },
      5,
    );
    return posts.map((p) => this.asBasicDto(p));
  }

  async commentPost(
    user: User,
    createCommentDto: CreateCommentDto,
    slug: string,
  ): Promise<PostDto> {
    if (!(await this.findOne({ slug }))) {
      throw new NotFoundException(
        HttpError.getHttpError(HttpErrorCode.POST_NOT_FOUND),
      );
    }
    const post = await this.postModel
      .findOneAndUpdate(
        { slug },
        {
          $addToSet: {
            comments: {
              _id: new Mongoose.Types.ObjectId(),
              commenter: user._id,
              // pseudo: user.pseudo,
              // picture: user.picture,
              comment: createCommentDto.comment,
              createdAt: Date.now(),
            },
          },
        },
        { new: true },
      )
      .populate('likers categories')
      .populate('comments.commenter', ['pseudo', 'picture']);
    return this.asDto(post, user);
  }

  async deletePostComment(
    user: User,
    slug: string,
    comment: DeleteCommentDto,
  ): Promise<PostDto> {
    await this.usersService.isSelfOrAdmin(comment.commenterId.toString(), user);
    if (!(await this.findOne({ slug }))) {
      throw new NotFoundException(
        HttpError.getHttpError(HttpErrorCode.POST_NOT_FOUND),
      );
    }
    const post = await this.postModel
      .findOneAndUpdate(
        { slug },
        {
          $pull: {
            comments: { _id: new Mongoose.Types.ObjectId(comment._id) },
          },
        },
        { new: true },
      )
      .populate('categories likers')
      .populate('comments.commenter', ['pseudo', 'picture']);
    return this.asDto(post, user);
  }

  async updatePostComment(
    user: User,
    slug: string,
    comment: UpdateCommentDto,
  ): Promise<PostDto> {
    await this.usersService.isSelfOrAdmin(comment.commenterId.toString(), user);
    if (!(await this.findOne({ slug }))) {
      throw new NotFoundException(
        HttpError.getHttpError(HttpErrorCode.POST_NOT_FOUND),
      );
    }
    const post = await this.postModel
      .findOneAndUpdate(
        { slug },
        {
          $set: {
            'comments.$[commentId].comment': comment.comment,
            'comments.$[commentId].updatedAt': Date.now(),
          },
        },
        { new: true, arrayFilters: [{ 'commentId._id': comment._id }] },
      )
      .populate('categories likers')
      .populate('comments.commenter', ['pseudo', 'picture']);
    return this.asDto(post, user);
  }

  private async checkIfPostIsDuplicatedBySlug(slug: string): Promise<PostDto> {
    const post = await this.findOne({ slug });
    return post ? this.asDto(post, null) : null;
  }

  async getPostLikeStatus(slug: string, user: User): Promise<boolean> {
    const post = await this.findOne({ slug });
    if (!post) return false;
    return !!post.likers.find((u) => u._id.toString() === user._id.toString());
  }

  async getCategorizedPosts(categoryName: string): Promise<PostDto[]> {
    const category = await this.categoriesService.findOne({
      name: categoryName,
    });
    if (!category) return [];
    const posts = await this.postModel
      .find({ categories: category._id })
      .populate('categories');
    return posts.map((post) => this.asDto(post));
  }

  private async find(match: MatchType = {}, limit = 0) {
    if (match._id) {
      if (!isValidObjectId(match._id)) {
        throw new BadRequestException(
          HttpError.getHttpError(HttpErrorCode.INVALID_ID),
        );
      } else {
        match._id = new Types.ObjectId(match._id as string);
      }
    }
    const docs = this.postModel
      .find(match, {
        _id: 1,
        title: 1,
        slug: 1,
        desc: 1,
        likers: 1,
        comments: 1,
        sourceName: 1,
        sourceLink: 1,
        picture: 1,
        categories: 1,
        createdAt: 1,
        updatedAt: 1,
      })
      .sort({ createdAt: -1 })
      .populate('categories likers')
      .populate('comments.commenter', ['pseudo', 'picture'])
      .sort({ createdAt: -1 });
    if (limit) docs.limit(limit);
    return docs;
  }

  async findOne(match: MatchType) {
    const posts = await this.find(match);
    if (posts.length > 0) {
      return posts[0];
    } else {
      return null;
    }
  }

  asBasicDto(post: Post): BasicPostDto {
    return {
      slug: post.slug,
      title: post.title,
      desc: post.desc,
      picture: post.picture,
    };
  }

  asDto(post: Post, authUser?: User): PostDto {
    let likeStatus = false;
    if (authUser) {
      likeStatus = !!post.likers.find(
        (u) => u._id.toString() === authUser._id.toString(),
      );
    }
    return {
      _id: post._id,
      slug: post.slug,
      title: post.title,
      categories: post.categories,
      likes: post.likers.length,
      authUserLiked: likeStatus,
      desc: post.desc,
      sourceName: post.sourceName,
      sourceLink: post.sourceLink,
      comments: post.comments,
      picture: post.picture,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
}
