import { PostsService } from './posts.service';
import { PostDto } from './dto/post.dto';
import { CreatePostDto } from './dto/create-post.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    create(createPostDto: CreatePostDto): Promise<PostDto>;
    getPosts(req: any): Promise<PostDto[]>;
    getLastPosts(req: any): Promise<PostDto[]>;
    getPost(req: any, slug: any): Promise<PostDto>;
}
