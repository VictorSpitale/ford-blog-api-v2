import {
  Body,
  Controller,
  Delete,
  Get,
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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllowAny } from '../auth/decorators/allow-any.decorator';
import { Role } from '../auth/decorators/roles.decorator';
import { IUserRole } from './entities/users.role.interface';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @ApiResponse({ status: 400, description: 'Validations failed' })
  @ApiResponse({ status: 409, description: 'The user already exist' })
  create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List all users', type: [UserDto] })
  @Role(IUserRole.ADMIN)
  async getUsers(): Promise<UserDto[]> {
    return this.usersService.getUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, description: 'User founded', type: UserDto })
  @ApiResponse({ status: 400, description: 'Id is not a valid id' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Role(IUserRole.ADMIN)
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ) {
    return this.usersService.update(id, updateUserDto, req.user);
  }

  @Patch('/upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
    @Param('id') id,
  ) {
    return this.usersService.uploadProfilePicture(id, file, req.user);
  }

  @Delete('/upload/:id')
  async removeProfilePicture(@Req() req, @Param('id') id) {
    return this.usersService.removeProfilePicture(id, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
