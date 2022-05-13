import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IUserRole } from '../../users/entities/users.role.interface';
import { UserDto } from '../../users/dto/user.dto';
import { ROLE_KEY } from '../decorators/roles.decorator';
import { HttpError, HttpErrorCode } from '../../shared/error/HttpError';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<IUserRole>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRole) {
      return true;
    }
    const { user }: { user: UserDto } = context.switchToHttp().getRequest();
    if (user.role >= requiredRole) return true;
    throw new UnauthorizedException(
      HttpError.getHttpError(HttpErrorCode.ROLE_UNAUTHORIZED),
    );
  }
}
