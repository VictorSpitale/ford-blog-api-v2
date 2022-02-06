import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
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
    description: "User's email",
    example: 'John@Doe.fr',
    required: true,
    pattern: `/^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$/`,
    type: String,
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    description: "User's password",
    example: 'password',
    minLength: 6,
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;
}
