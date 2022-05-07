import { PostDto } from './post.dto';

export class PaginatedPostDto {
  readonly hasMore: boolean;
  readonly posts: [PostDto];
}
