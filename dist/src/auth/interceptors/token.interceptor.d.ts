import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { UserDto } from '../../users/dto/user.dto';
export declare class TokenInterceptor implements NestInterceptor {
    private readonly authService;
    constructor(authService: AuthService);
    intercept(context: ExecutionContext, next: CallHandler<UserDto>): Observable<UserDto>;
}
