import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostDto } from './dto/post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { Role } from '../auth/decorators/roles.decorator';
import { IUserRole } from '../users/entities/users.role.interface';
import { AllowAny } from '../auth/decorators/allow-any.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a post' })
  @ApiResponse({
    status: 201,
    description: 'The post has been created',
    type: PostDto,
  })
  @ApiResponse({ status: 400, description: 'Validations failed' })
  @ApiResponse({ status: 403, description: 'Forbidden ressource' })
  @ApiResponse({
    status: 409,
    description: 'The post with this slug already exist',
  })
  @UseInterceptors(FileInterceptor('file'))
  @Role(IUserRole.POSTER)
  create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<PostDto> {
    return this.postsService.create(createPostDto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'List all posts', type: [PostDto] })
  async getPosts(@Req() req): Promise<PostDto[]> {
    return this.postsService.getPosts(req.user);
  }

  @Get('last')
  @ApiOperation({ summary: 'Get 6 last posts' })
  @ApiResponse({
    status: 200,
    description: 'List the 6 last posts',
    type: [PostDto],
  })
  @AllowAny()
  async getLastPosts(@Req() req): Promise<PostDto[]> {
    return this.postsService.getLastPosts(req.user);
  }

  @Get(':slug')
  @AllowAny()
  async getPost(@Req() req, @Param('slug') slug): Promise<PostDto> {
    return this.postsService.getPost(slug, req.user);
  }
}
