import * as Mongoose from 'mongoose';
import { CreateUserDto } from './create-user.dto';
import {
  IsDateString,
  IsEnum,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { IUserRole } from '../entities/users.role.interface';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { urlPattern } from '../../shared/utils/regex.validation';

export class UserDto extends PickType(CreateUserDto, ['email', 'pseudo']) {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({
    type: String,
    description: "User's id",
    example: '61f59acf09f089c9df951c37',
  })
  readonly _id: Mongoose.Types.ObjectId;

  @IsNotEmpty()
  @IsEnum(IUserRole)
  @IsIn(Object.keys(IUserRole))
  @ApiProperty({
    description: "User's role",
    default: IUserRole.USER,
    enum: IUserRole,
    type: IUserRole,
    examples: [IUserRole.USER, 'user'],
  })
  readonly role: IUserRole;

  @IsString()
  @MinLength(6)
  @Matches('^\\$2[ayb]\\$.{56}$')
  @ApiProperty({
    description: "User's hashed password",
    type: String,
  })
  readonly password?: string;

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
    description: "User's created date",
    type: String,
    format: 'YYYY-mm-ddTHH:MM:ssZ',
  })
  readonly createdAt: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: "User's last update date",
    type: String,
    format: 'YYYY-mm-ddTHH:MM:ssZ',
  })
  readonly updatedAt: string;
}
