import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ALLOW_ANY_KEY } from '../decorators/allow-any.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  handleRequest(err, user, info, context) {
    const allowAny = this.reflector.get<string[]>(
      ALLOW_ANY_KEY,
      context.getHandler(),
    );
    if (user) return user;
    if (allowAny) return null;
    throw new UnauthorizedException('Jwt failed');
  }
}
