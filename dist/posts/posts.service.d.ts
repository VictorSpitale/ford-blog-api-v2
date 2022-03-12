/// <reference types="multer" />
import { Post, PostDocument } from './entities/post.entity';
import { Model } from 'mongoose';
import { MatchType } from '../shared/types/match.types';
import { PostDto } from './dto/post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '../users/entities/user.entity';
import { GoogleService } from '../cloud/google.service';
export declare class PostsService {
    private readonly postModel;
    private readonly googleService;
    constructor(postModel: Model<PostDocument>, googleService: GoogleService);
    create(createPostDto: CreatePostDto, file: Express.Multer.File): Promise<PostDto | any>;
    getPosts(user: User): Promise<PostDto[]>;
    getLastPosts(user: User): Promise<PostDto[]>;
    getPost(slug: string, user: User): Promise<PostDto>;
    private checkIfPostIsDuplicatedBySlug;
    private find;
    findOne(match: MatchType): Promise<Post | null>;
    asDto(post: Post, authUser: User): PostDto;
}
