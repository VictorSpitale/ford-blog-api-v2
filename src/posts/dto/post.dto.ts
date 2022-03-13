import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Matches,
} from 'class-validator';
import * as Mongoose from 'mongoose';
import { CommentDto } from './comment.dto';
import { CategoryDto } from '../../categories/dto/category.dto';
import { urlPattern } from '../../shared/utils/regex.validation';

export class PostDto extends OmitType(CreatePostDto, [
  'categories',
  'file',
] as const) {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({
    type: String,
    description: "Post's id",
    example: '61f59acf09f089c9df951c37',
  })
  readonly _id: Mongoose.Types.ObjectId;

  @ApiProperty({
    description: "Post's category ids",
    example: `[{
            "_id": "621bd3239a004010c4ba3b06",
            "name": "sport"
        }]`,
    required: true,
    type: [CategoryDto],
  })
  @IsArray()
  @IsNotEmpty()
  readonly categories: CategoryDto[];

  @ApiProperty({
    description: 'Number of likes',
    example: '12',
    type: Number,
  })
  @IsNumber()
  readonly likes: number;

  @ApiProperty({
    description: 'Auth user like status',
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  readonly authUserLiked: boolean;

  @IsArray()
  @ApiProperty({
    description: "Post's comments",
    example: `[{
            "_id": "621bd3239a004010c4ba3b06",
            "commenter": {
              pseudo: 'John',
              picture: 'url_to_picture'
             },
            "comment": "my comment",
            "createdAt": "date",
            "updatedAt": "date"
        }]`,
    type: [CommentDto],
  })
  readonly comments: CommentDto[];

  @ApiProperty({
    description: 'Url to the picture',
    example: 'https://storage.googleapis.com/name',
    type: String,
    pattern: urlPattern,
  })
  @IsOptional()
  @Matches(urlPattern)
  readonly picture?: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Post's created date",
    type: String,
    format: 'YYYY-mm-ddTHH:MM:ssZ',
  })
  readonly createdAt: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Post's last update date",
    type: String,
    format: 'YYYY-mm-ddTHH:MM:ssZ',
  })
  readonly updatedAt: string;
}
