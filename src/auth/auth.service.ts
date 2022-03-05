import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { UserDto } from '../users/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtAccessToken, JwtPayload } from './jwt/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email, password): Promise<UserDto | null> {
    const user: User = await this.usersService.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Not user with this email');
    }
    if (!(await user.checkPassword(password))) {
      throw new UnauthorizedException('Wrong password');
    }
    return this.usersService.asDtoWithoutPassword(user);
  }

  signToken(user: UserDto): string {
    const payload = { email: user.email, sub: user._id };
    return this.jwtService.sign(payload);
  }

  async verifyPayload(payload: JwtPayload): Promise<UserDto> {
    const user: User = await this.usersService.findOne({ _id: payload.sub });
    if (!user) {
      throw new UnauthorizedException('No user');
    }
    return this.usersService.asDtoWithoutPassword(user);
  }

  async login(user: UserDto): Promise<JwtAccessToken> {
    const payload = { email: user.email, sub: user._id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
