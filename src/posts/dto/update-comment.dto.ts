import { ApiProperty, PickType } from '@nestjs/swagger';
import { CommentDto } from './comment.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import * as Mongoose from 'mongoose';

export class UpdateCommentDto extends PickType(CommentDto, ['comment', '_id']) {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({
    type: String,
    description: 'comment id',
    example: '61f59acf09f089c9df951c37',
  })
  readonly commenterId: Mongoose.Types.ObjectId;
}
