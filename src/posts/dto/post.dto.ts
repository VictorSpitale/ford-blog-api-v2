import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { IsArray, IsDateString, IsMongoId, IsNotEmpty } from 'class-validator';
import * as Mongoose from 'mongoose';
import { CommentDto } from './comment.dto';
import { CategoryDto } from '../../categories/dto/category.dto';

export class PostDto extends OmitType(CreatePostDto, ['categories'] as const) {
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

  @IsMongoId({ each: true })
  @ApiProperty({
    description: "Likers'id list",
    example: '[621bd3239a004010c4ba3b06]',
    type: [String],
  })
  readonly likers: Mongoose.Types.ObjectId[];

  @IsArray()
  @ApiProperty({
    description: "Post's comments",
    example: `[{
            "_id": "621bd3239a004010c4ba3b06",
            "commenter": {
              _id: 61f59acf09f089c9df951c37
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
