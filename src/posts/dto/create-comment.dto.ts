import { PickType } from '@nestjs/swagger';
import { CommentDto } from './comment.dto';

export class CreateCommentDto extends PickType(CommentDto, ['comment']) {}
