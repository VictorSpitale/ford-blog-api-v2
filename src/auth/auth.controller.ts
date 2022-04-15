import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthUser } from '../users/user.decorator';
import { UserDto } from '../users/dto/user.dto';
import { AllowAny } from './decorators/allow-any.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { UsersService } from '../users/users.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  // @UseInterceptors(TokenInterceptor)
  @AllowAny()
  @ApiOperation({ summary: 'Get an access token for a user' })
  async login(@AuthUser() user: UserDto, @Res() response: Response) {
    const { access_token } = await this.authService.login(user);
    return this.authService.setCookie(response, access_token, { access_token });
  }

  @Get('/jwt')
  @AllowAny()
  async verifyToken(@Req() req: Request) {
    const id = await this.authService.decodePayload(req.cookies?.access_token);
    return this.usersService.getUserById(id);
  }

  @Get('/g-jwt/:token')
  @HttpCode(HttpStatus.OK)
  @AllowAny()
  async setCookieFromGoogle(@Res() res: Response, @Param('token') token) {
    return this.authService.setCookieFromGoogle(res, token);
  }

  @Get('/me')
  async getProfile(@AuthUser() user: UserDto) {
    return user;
  }

  @Get('/google')
  @AllowAny()
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  async googleAuth(@Req() req) {}

  @Get('/google/redirect')
  @AllowAny()
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req, @Res() res) {
    return this.authService.googleLogin(req, res);
  }
}
