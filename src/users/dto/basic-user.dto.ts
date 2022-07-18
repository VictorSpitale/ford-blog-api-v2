import { PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class BasicUserDto extends PickType(UserDto, [
  '_id',
  'pseudo',
  'picture',
]) {}
