import { AuthService } from './auth.service';
import { UserDto } from '../users/dto/user.dto';
import { JwtAccessToken } from './jwt/jwt-payload.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(user: UserDto): Promise<JwtAccessToken>;
    verifyToken(headers: any): Promise<any>;
    getProfile(user: UserDto): Promise<UserDto>;
    googleAuth(req: any): Promise<void>;
    googleAuthRedirect(req: any, res: any): Promise<void | "No user from google">;
}
