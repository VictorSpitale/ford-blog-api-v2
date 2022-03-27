import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { UserDto } from '../users/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtAccessToken, JwtPayload } from './jwt/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { uuid } from '../shared/utils/password.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email, password): Promise<UserDto | null> {
    const user: User = await this.usersService.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('No user with this email');
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

  async decodePayload(jwtToken: string) {
    const bearerRegex = /Bearer (.*)/gm;
    const token = bearerRegex.exec(jwtToken)[1];
    return this.jwtService.decode(token)?.sub;
  }

  async login(user: UserDto): Promise<JwtAccessToken> {
    const payload = { email: user.email, sub: user._id };
    return { access_token: this.jwtService.sign(payload) };
  }

  validateApiKey(apiKey: string): boolean {
    const key = this.configService.get('api_key.key');
    return apiKey === key;
  }

  async googleLogin(req, res: Response) {
    if (!req.user) {
      return 'No user from google';
    }
    let userDto;
    try {
      userDto = await this.usersService.create({
        email: req.user.email,
        pseudo: req.user.pseudo.substring(0, 18),
        password: uuid(),
      });
    } catch (e) {
      if (e.status !== 409) {
        return res.redirect(
          `${this.configService.get('google.client_url')}/login?status=failed`,
        );
      } else {
        userDto = await this.usersService.getUserByEmail(req.user.email);
      }
    }
    try {
      const { access_token } = await this.login(userDto);
      return res.redirect(
        `${this.configService.get(
          'google.client_url',
        )}/account?token=${access_token}`,
      );
    } catch (e) {
      return res.redirect(
        `${this.configService.get('google.client_url')}/login?status=failed`,
      );
    }
  }
}
