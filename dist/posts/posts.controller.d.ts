/// <reference types="multer" />
import { PostsService } from './posts.service';
import { PostDto } from './dto/post.dto';
import { CreatePostDto } from './dto/create-post.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    create(createPostDto: CreatePostDto, file: Express.Multer.File): Promise<PostDto>;
    getPosts(req: any): Promise<PostDto[]>;
    getLastPosts(req: any): Promise<PostDto[]>;
    getQueriedPosts(search: any): Promise<PostDto[]>;
    getPost(req: any, slug: any): Promise<PostDto>;
    likePost(req: any, slug: any): Promise<number>;
    unlikePost(req: any, slug: any): Promise<number>;
    deletePost(req: any, slug: any): Promise<void>;
}
