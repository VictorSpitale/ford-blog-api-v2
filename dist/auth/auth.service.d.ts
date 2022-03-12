import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtAccessToken, JwtPayload } from './jwt/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly configService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    validateUser(email: any, password: any): Promise<UserDto | null>;
    signToken(user: UserDto): string;
    verifyPayload(payload: JwtPayload): Promise<UserDto>;
    login(user: UserDto): Promise<JwtAccessToken>;
    validateApiKey(apiKey: string): boolean;
}