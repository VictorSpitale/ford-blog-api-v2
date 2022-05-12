import * as Mongoose from 'mongoose';
import { IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CommenterDto } from '../../users/dto/commenter.dto';

export class CommentDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({
    type: String,
    description: "Comment's id",
    example: '61f59acf09f089c9df951c37',
  })
  readonly _id: Mongoose.Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({
    type: CommenterDto,
    description: "Commenter's informations",
    example: `{
        id: "61f59acf09f089c9df951c37",
        pseudo: 'John',
        picture: 'url_to_picture'
    }`,
  })
  readonly commenter: CommenterDto;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Comment',
    example: 'What a beautiful car!',
  })
  readonly comment: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: "Comment's created date (timestamp)",
    type: Number,
  })
  readonly createdAt: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: "Comment's last update date (timestamp)",
    type: Number,
    required: false,
  })
  readonly updatedAt?: number;
}
