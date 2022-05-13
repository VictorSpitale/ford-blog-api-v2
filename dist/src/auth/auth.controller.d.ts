import { AuthService } from './auth.service';
import { UserDto } from '../users/dto/user.dto';
import { Request, Response } from 'express';
import { UsersService } from '../users/users.service';
export declare class AuthController {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(authUser: UserDto, response: Response): Promise<Response<any, Record<string, any>>>;
    logout(response: Response): Promise<Response<any, Record<string, any>>>;
    verifyToken(req: Request): Promise<UserDto>;
    setCookieFromGoogle(res: Response, token: any): Promise<Response<any, Record<string, any>>>;
    googleAuth(req: any): Promise<void>;
    googleAuthRedirect(req: any, res: any): Promise<void | "No user from google">;
}
