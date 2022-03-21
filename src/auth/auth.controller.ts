import {
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { AuthUser } from '../users/user.decorator';
import { UserDto } from '../users/dto/user.dto';
import { JwtAccessToken } from './jwt/jwt-payload.interface';
import { AllowAny } from './decorators/allow-any.decorator';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TokenInterceptor)
  @AllowAny()
  @ApiOperation({ summary: 'Get an access token for a user' })
  async login(@AuthUser() user: UserDto): Promise<JwtAccessToken> {
    return this.authService.login(user);
  }

  @Get('/jwt')
  @AllowAny()
  async verifyToken(@Headers('authorization') headers) {
    return this.authService.decodePayload(headers);
  }

  @Get('/me')
  async getProfile(@AuthUser() user: UserDto) {
    return user;
  }
}
