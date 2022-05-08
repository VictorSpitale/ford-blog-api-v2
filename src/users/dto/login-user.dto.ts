import { PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class LoginUserDto extends PickType(UserDto, ['email', 'password']) {}
