import { PostDto } from './post.dto';
export declare class PaginatedPostDto {
    readonly hasMore: boolean;
    readonly posts: [PostDto];
    readonly page: number;
}
