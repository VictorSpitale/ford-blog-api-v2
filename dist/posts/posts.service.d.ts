/// <reference types="multer" />
import { Post, PostDocument } from './entities/post.entity';
import { Model } from 'mongoose';
import { MatchType } from '../shared/types/match.types';
import { PostDto } from './dto/post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '../users/entities/user.entity';
import { GoogleService } from '../cloud/google.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { UsersService } from '../users/users.service';
export declare class PostsService {
    private readonly postModel;
    private readonly googleService;
    private readonly usersService;
    constructor(postModel: Model<PostDocument>, googleService: GoogleService, usersService: UsersService);
    create(createPostDto: CreatePostDto, file: Express.Multer.File): Promise<PostDto | any>;
    likePost(slug: any, user: any): Promise<number>;
    unlikePost(slug: any, user: any): Promise<number>;
    private updateLikeStatus;
    deletePost(slug: string, user: User): Promise<void>;
    updatePost(slug: string, updatePostDto: UpdatePostDto, user: User): Promise<PostDto>;
    getPosts(user: User, page: number): Promise<{
        hasMore: boolean;
        posts: PostDto[];
        page: number;
    }>;
    getLastPosts(user: User): Promise<PostDto[]>;
    getPost(slug: string, user: User): Promise<PostDto>;
    getLikedPosts(userId: string, authUser: User): Promise<{
        slug: string;
        title: string;
        desc: string;
        picture: string;
    }[]>;
    getQueriedPosts(search: string): Promise<PostDto[]>;
    private checkIfPostIsDuplicatedBySlug;
    private find;
    findOne(match: MatchType): Promise<Post & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>;
    asBasicDto(post: Post): {
        slug: string;
        title: string;
        desc: string;
        picture: string;
    };
    asDto(post: Post, authUser?: User): PostDto;
}
