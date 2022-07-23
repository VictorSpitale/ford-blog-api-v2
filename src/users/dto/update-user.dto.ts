import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IUserRole } from '../entities/users.role.interface';

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

  @ApiProperty({
    description: "User's password",
    example: 'password',
    minLength: 6,
    required: false,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @IsOptional()
  readonly password?: string;

  @ApiProperty({
    description: "User's current password",
    example: 'password',
    minLength: 6,
    required: false,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @IsOptional()
  readonly currentPassword?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(IUserRole)
  @IsIn(Object.values(IUserRole))
  @ApiProperty({
    description: "User's role",
    default: IUserRole.USER,
    enum: IUserRole,
    type: IUserRole,
    examples: [IUserRole.USER, 'user'],
    required: false,
  })
  readonly role?: IUserRole;
}
