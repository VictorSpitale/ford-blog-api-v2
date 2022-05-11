import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { urlPattern } from '../../shared/utils/regex.validation';
import * as Mongoose from 'mongoose';

export class CommenterDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({
    type: String,
    description: 'User id',
    example: '61f59acf09f089c9df951c37',
  })
  readonly _id: Mongoose.Types.ObjectId;

  @ApiProperty({
    description: "User's pseudo",
    example: 'John Doe',
    minLength: 6,
    maxLength: 18,
    required: true,
    type: String,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(18)
  @IsNotEmpty()
  readonly pseudo: string;

  @ApiProperty({
    description: "User's profile picture",
    example: 'url_to_picture',
    type: String,
  })
  @IsString()
  @IsUrl()
  @Matches(urlPattern)
  readonly picture?: string;
}
