import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { LocalesTypes } from '../../shared/types/locales.types';
import { UserDto } from './user.dto';
import { CreateUserDto } from './create-user.dto';

export class PasswordPreRecoveryDto extends PickType(UserDto, ['email']) {
  @IsNotEmpty()
  @IsString()
  @IsIn(['fr', 'en'])
  @ApiProperty({
    description: "User's locale",
    examples: ['fr', 'en'],
  })
  readonly locale: LocalesTypes;
}

export class PasswordRecoveryDto extends PickType(CreateUserDto, [
  'password',
]) {}
