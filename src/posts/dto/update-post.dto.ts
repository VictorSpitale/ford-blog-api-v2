import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { urlPattern } from '../../shared/utils/regex.validation';
import * as Mongoose from 'mongoose';

export class UpdatePostDto {
  @ApiProperty({
    description: "Post's title",
    example: 'The new ford mustang',
    required: false,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly title?: string;

  @ApiProperty({
    description: "Post's desc",
    example: 'It is the story about...',
    required: false,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly desc?: string;

  @ApiProperty({
    description: "Source's name",
    example: 'auto-moto',
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly sourceName?: string;

  @ApiProperty({
    description: "Source's link",
    example: 'https://auto-moto.fr',
    required: false,
    type: String,
    pattern: urlPattern,
  })
  @Matches(urlPattern)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly sourceLink?: string;

  @ApiProperty({
    description: "Post's category ids",
    example: '[621bd3239a004010c4ba3b06e]',
    required: false,
    type: [String],
  })
  @IsMongoId({ each: true })
  @IsNotEmpty()
  @IsOptional()
  readonly categories?: Mongoose.Types.ObjectId[];
}
