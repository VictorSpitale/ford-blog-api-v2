/// <reference types="multer" />
import { PostsService } from './posts.service';
import { PostDto } from './dto/post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { BasicPostDto } from './dto/basic-post.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    create(createPostDto: CreatePostDto, file: Express.Multer.File): Promise<PostDto>;
    getPosts(req: any, page: any): Promise<{
        hasMore: boolean;
        posts: PostDto[];
        page: number;
    }>;
    getLastPosts(req: any): Promise<PostDto[]>;
    getQueriedPosts(search: any): Promise<PostDto[]>;
    getLikedPost(req: any, id: any): Promise<BasicPostDto[]>;
    getPost(req: any, slug: any): Promise<PostDto>;
    likePost(req: any, slug: any): Promise<number>;
    unlikePost(req: any, slug: any): Promise<number>;
    deletePost(req: any, slug: any): Promise<void>;
    updatePost(req: any, updatePostDto: UpdatePostDto, slug: any): Promise<PostDto>;
}
