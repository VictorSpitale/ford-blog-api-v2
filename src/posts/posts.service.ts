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

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<PostDto> {
    if (await this.checkIfPostIsDuplicatedBySlug(createPostDto.slug)) {
      throw new ConflictException('post with this slug already exist');
    }
    const createdPost = await this.postModel.create(createPostDto);
    await createdPost.populate('categories');
    await createdPost.save();
    return this.asDto(createdPost, null);
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
      throw new NotFoundException();
    }
    return this.asDto(post, user);
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
      .sort({ createdAt: -1 });
    docs.populate('categories likers');
    if (limit) docs.limit(limit);
    return docs;
  }

  async findOne(match: MatchType): Promise<Post | null> {
    const posts = await this.find(match);
    if (posts.length > 0) {
      return posts[0];
    } else {
      return null;
    }
  }

  asDto(post: Post, authUser: User): PostDto {
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
