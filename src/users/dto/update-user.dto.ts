import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: "User's pseudo",
    example: 'John Doe',
    minLength: 6,
    maxLength: 18,
    required: false,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(18)
  @IsOptional()
  readonly pseudo?: string;
}
