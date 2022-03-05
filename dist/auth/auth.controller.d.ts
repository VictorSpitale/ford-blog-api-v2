import { AuthService } from './auth.service';
import { UserDto } from '../users/dto/user.dto';
import { JwtAccessToken } from './jwt/jwt-payload.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(user: UserDto): Promise<JwtAccessToken>;
    getProfile(user: UserDto): Promise<UserDto>;
}
