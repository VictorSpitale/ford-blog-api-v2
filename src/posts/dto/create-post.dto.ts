import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString, Matches } from 'class-validator';
import { urlPattern } from '../../shared/utils/regex.validation';
import * as Mongoose from 'mongoose';

export class CreatePostDto {
  @ApiProperty({
    description: "Post's title",
    example: 'The new ford mustang',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({
    description: "Post's slug",
    example: 'the-new-ford-mustang',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly slug: string;

  @ApiProperty({
    description: "Post's desc",
    example: 'It is the story about...',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly desc: string;

  @ApiProperty({
    description: "Source's name",
    example: 'auto-moto',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly sourceName: string;

  @ApiProperty({
    description: "Source's link",
    example: 'https://auto-moto.fr',
    required: true,
    type: String,
    pattern: urlPattern,
  })
  @Matches(urlPattern)
  @IsString()
  @IsNotEmpty()
  readonly sourceLink: string;

  @ApiProperty({
    description: "Post's category ids",
    example: '[621bd3239a004010c4ba3b06e]',
    required: true,
    type: [String],
  })
  @IsMongoId({ each: true })
  @IsNotEmpty()
  readonly categories: Mongoose.Types.ObjectId[];
}
