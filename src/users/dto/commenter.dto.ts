import {
  IsNotEmpty,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { urlPattern } from '../../shared/utils/regex.validation';

export class CommenterDto {
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
