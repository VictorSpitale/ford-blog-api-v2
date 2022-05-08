import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AllowAny } from '../auth/decorators/allow-any.decorator';
import { Role } from '../auth/decorators/roles.decorator';
import { IUserRole } from './entities/users.role.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  PasswordPreRecoveryDto,
  PasswordRecoveryDto,
} from './dto/password-recovery.dto';
import { HttpErrorDto, HttpValidationError } from '../shared/error/HttpError';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @AllowAny()
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been created',
    type: UserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validations failed',
    type: HttpValidationError,
  })
  @ApiResponse({
    status: 409,
    description: 'The user already exist',
    type: HttpErrorDto,
  })
  create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List all users', type: [UserDto] })
  @ApiResponse({
    status: 401,
    description: 'Jwt failed | Insufficient permissions',
    type: HttpErrorDto,
  })
  @Role(IUserRole.ADMIN)
  @ApiCookieAuth()
  async getUsers(): Promise<UserDto[]> {
    return this.usersService.getUsers();
  }

  @Get(':id')
  @ApiParam({
    description: 'User id',
    type: String,
    name: 'id',
  })
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, description: 'User found', type: UserDto })
  @ApiResponse({
    status: 400,
    description: 'Id is not a valid id',
    type: HttpErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: HttpErrorDto,
  })
  @ApiCookieAuth()
  @Role(IUserRole.ADMIN)
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({
    description: 'User id',
    type: String,
    name: 'id',
  })
  @ApiResponse({
    status: 200,
    description: 'The updated user',
    type: UserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validations failed',
    type: HttpValidationError,
  })
  @ApiResponse({
    status: 401,
    description: 'Jwt failed | Insufficient permissions',
    type: HttpErrorDto,
  })
  @ApiCookieAuth()
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ) {
    return this.usersService.update(id, updateUserDto, req.user);
  }

  @Patch('/upload/:id')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a profile picture' })
  @ApiParam({
    description: 'User id',
    type: String,
    name: 'id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          maxItems: 1,
          nullable: false,
        },
      },
    },
  })
  @ApiResponse({
    description: 'The profile picture url',
    status: 200,
    schema: {
      type: 'object',
      required: ['picture'],
      properties: {
        picture: {
          type: 'string',
          description: 'url to the profile picture',
          example: 'https://storage.googleapis.com/path',
        },
      },
    },
  })
  @ApiResponse({
    description: 'Bad file format',
    status: 400,
    type: HttpErrorDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Jwt failed | Insufficient permissions',
    type: HttpErrorDto,
  })
  @ApiResponse({
    description: 'Upload failed',
    status: 500,
    type: HttpErrorDto,
  })
  @ApiCookieAuth()
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
    @Param('id') id,
  ) {
    return this.usersService.uploadProfilePicture(id, file, req.user);
  }

  @Delete('/upload/:id')
  @ApiOperation({ summary: 'Delete profile picture' })
  @ApiParam({
    description: 'User id',
    type: String,
    name: 'id',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile picture deleted',
  })
  @ApiResponse({
    status: 401,
    description: 'Jwt failed | Insufficient permissions',
    type: HttpErrorDto,
  })
  @ApiCookieAuth()
  async removeProfilePicture(@Req() req, @Param('id') id) {
    return this.usersService.removeProfilePicture(id, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user account' })
  @ApiParam({
    description: 'User id',
    type: String,
    name: 'id',
  })
  @ApiResponse({
    status: 200,
    description: 'User account deleted',
  })
  @ApiResponse({
    status: 401,
    description: 'Jwt failed | Insufficient permissions',
    type: HttpErrorDto,
  })
  @ApiCookieAuth()
  async deleteUser(@Req() req, @Param('id') id: string) {
    return this.usersService.deleteUser(id, req.user);
  }

  @Post('password')
  @HttpCode(HttpStatus.OK)
  @AllowAny()
  @ApiOperation({ summary: 'Send password recovery email' })
  @ApiResponse({
    status: 200,
    description: 'Email sent',
  })
  async sendPasswordRecovery(@Body() body: PasswordPreRecoveryDto) {
    return this.usersService.sendPasswordRecovery(body.email, body.locale);
  }

  @Post('/password/:token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change user password after recovery' })
  @ApiParam({
    description: 'Recovery token',
    type: String,
    name: 'token',
  })
  @ApiResponse({
    status: 200,
    description: 'Password changed',
  })
  @AllowAny()
  async recoverPassword(
    @Body() body: PasswordRecoveryDto,
    @Param('token') token,
  ) {
    return this.usersService.recoverPassword(token, body);
  }
}
