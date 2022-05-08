import { PostDto } from './post.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedPostDto {
  @ApiProperty({
    required: true,
    type: Boolean,
    description: 'Has more posts',
    example: true,
  })
  readonly hasMore: boolean;

  @ApiProperty({
    required: true,
    type: [PostDto],
    description: 'Posts',
  })
  readonly posts: [PostDto];
}
