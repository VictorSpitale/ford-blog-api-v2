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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthUser } from '../users/user.decorator';
import { UserDto } from '../users/dto/user.dto';
import { AllowAny } from './decorators/allow-any.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { HttpErrorDto } from '../shared/error/HttpError';

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
  @ApiBody({
    description: "User's credentials",
    required: true,
    type: LoginUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Setting jwt cookie',
  })
  @ApiResponse({
    description: 'Bad credentials',
    status: 401,
    type: HttpErrorDto,
  })
  async login(@AuthUser() authUser: UserDto, @Res() response: Response) {
    const { access_token } = await this.authService.login(authUser);
    const user = await this.usersService.getUserById(authUser._id.toString());
    return this.authService.setCookie(response, access_token, user);
  }

  @Get('logout')
  @ApiOperation({ summary: 'Logout a user' })
  @ApiResponse({
    description: 'Removing the jwt cookie',
    status: 200,
  })
  @ApiResponse({
    description: 'Jwt failed',
    status: 401,
    type: HttpErrorDto,
  })
  async logout(@Res() response: Response) {
    return this.authService.logout(response);
  }

  @Get('/jwt')
  @ApiOperation({ summary: 'Get user information by its jwt cookie' })
  @ApiResponse({
    description: 'User information',
    status: 200,
    type: UserDto,
  })
  @ApiResponse({
    description: 'Jwt failed',
    status: 401,
    type: HttpErrorDto,
  })
  @ApiResponse({
    description: 'User not found',
    status: 404,
    type: HttpErrorDto,
  })
  async verifyToken(@Req() req: Request) {
    const id = await this.authService.decodePayload(req.cookies?.access_token);
    return this.usersService.getUserById(id);
  }

  @Get('/g-jwt/:token')
  @HttpCode(HttpStatus.OK)
  @AllowAny()
  @ApiOperation({ summary: 'Set jwt cookie on Google Auth' })
  @ApiParam({
    description: 'Jwt token',
    required: true,
    type: String,
    name: 'token',
  })
  @ApiResponse({
    description: 'Setting jwt on Google Auth',
    status: 200,
  })
  @ApiResponse({
    description: 'Google Auth failed',
    status: 400,
    type: HttpErrorDto,
  })
  async setCookieFromGoogle(@Res() res: Response, @Param('token') token) {
    return this.authService.setCookieFromGoogle(res, token);
  }

  @Get('/google')
  @AllowAny()
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Redirect to Google Auth' })
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  async googleAuth(@Req() req) {}

  @Get('/google/redirect')
  @AllowAny()
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Redirect to the front-end application after Google Auth',
  })
  googleAuthRedirect(@Req() req, @Res() res) {
    return this.authService.googleLogin(req, res);
  }
}
