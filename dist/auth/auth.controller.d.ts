import { AuthService } from './auth.service';
import { UserDto } from '../users/dto/user.dto';
import { Request, Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(user: UserDto, response: Response): Promise<Response<any, Record<string, any>>>;
    verifyToken(req: Request): Promise<any>;
    getProfile(user: UserDto): Promise<UserDto>;
    googleAuth(req: any): Promise<void>;
    googleAuthRedirect(req: any, res: any): Promise<void | "No user from google">;
}
