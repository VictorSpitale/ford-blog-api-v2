import { PickType } from '@nestjs/swagger';
import { CommentDto } from './comment.dto';

export class UpdateCommentDto extends PickType(CommentDto, [
  'comment',
  '_id',
]) {}
