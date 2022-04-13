import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './entities/post.entity';
import { isValidObjectId, Model, Types } from 'mongoose';
import { MatchType } from '../shared/types/match.types';
import { PostDto } from './dto/post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '../users/entities/user.entity';
import { GoogleService } from '../cloud/google.service';
import { UploadTypes } from '../shared/types/upload.types';
import { LikeOperation } from '../shared/types/post.types';
import { HttpError, HttpErrorCode } from '../shared/error/HttpError';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    private readonly googleService: GoogleService,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    file: Express.Multer.File,
  ): Promise<PostDto | any> {
    if (await this.checkIfPostIsDuplicatedBySlug(createPostDto.slug)) {
      throw new ConflictException('post with this slug already exist');
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

  async likePost(slug, user) {
    return this.updateLikeStatus(slug, user, LikeOperation.LIKE);
  }

  async unlikePost(slug, user) {
    return this.updateLikeStatus(slug, user, LikeOperation.UNLIKE);
  }

  private async updateLikeStatus(slug, user, operation: LikeOperation) {
    if (!(await this.postModel.findOne({ slug }))) {
      throw new NotFoundException(
        HttpError.getHttpError(HttpErrorCode.POST_NOT_FOUND),
      );
    }
    await this.postModel.findOneAndUpdate(
      { slug },
      { [operation]: { likers: user._id } },
    );
    const post = await this.findOne({ slug });
    return this.asDto(post, user).likes;
  }

  async deletePost(slug: string, user: User) {
    await this.getPost(slug, user);
    await this.postModel.findOneAndDelete({ slug });
  }

  async getPosts(user: User): Promise<PostDto[]> {
    const posts = await this.find({});
    return posts.map((p) => this.asDto(p, user));
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

  async getQueriedPosts(search: string) {
    if (!search || (search && search.length < 3)) {
      throw new BadRequestException(
        'Search query is missing or should be more than 2 characters',
      );
    }
    const searchReg = new RegExp('.*' + search + '.*', 'i');
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
    return posts.map((p) => this.asDto(p));
  }

  private async checkIfPostIsDuplicatedBySlug(slug: string): Promise<PostDto> {
    const post = await this.findOne({ slug });
    return post ? this.asDto(post, null) : null;
  }

  private async find(match: MatchType = {}, limit = 0) {
    if (match._id) {
      if (!isValidObjectId(match._id)) {
        throw new BadRequestException();
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
      .populate('categories likers');
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
