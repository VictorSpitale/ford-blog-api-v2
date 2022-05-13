import { PickType } from '@nestjs/swagger';
import { PostDto } from './post.dto';

export class BasicPostDto extends PickType(PostDto, [
  'picture',
  'slug',
  'title',
  'desc',
]) {}
