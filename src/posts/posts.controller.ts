import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a post' })
  @ApiResponse({
    status: 201,
    description: 'The post has been created',
    type: PostDto,
  })
  @ApiResponse({ status: 400, description: 'Validations failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
  @ApiResponse({
    status: 409,
    description: 'A post with this slug already exist',
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

  @Get('query')
  @ApiQuery({ name: 'search' })
  @ApiResponse({
    status: 200,
    description: 'List the 5 queried posts',
    type: [PostDto],
  })
  @ApiResponse({
    status: 400,
    description:
      'Search query failed, search must be defined and more than 2 characters',
  })
  @AllowAny()
  async getQueriedPosts(@Query('search') search) {
    return this.postsService.getQueriedPosts(search);
  }

  @Get(':slug')
  @AllowAny()
  @ApiResponse({
    status: 200,
    description: 'The post got by its slug',
    type: PostDto,
  })
  @ApiResponse({
    status: 404,
    description: 'The post doesnt exist',
  })
  async getPost(@Req() req, @Param('slug') slug): Promise<PostDto> {
    return this.postsService.getPost(slug, req.user);
  }

  @Patch('/like/:slug')
  @ApiResponse({
    status: 200,
    description: 'The post has been liked, return the number of likes',
    type: Number,
  })
  @ApiResponse({
    status: 404,
    description: 'The post doesnt exist',
  })
  async likePost(@Req() req, @Param('slug') slug) {
    return this.postsService.likePost(slug, req.user);
  }

  @Patch('/unlike/:slug')
  @ApiResponse({
    status: 200,
    description: 'The post has been unliked, return the number of likes',
    type: Number,
  })
  @ApiResponse({
    status: 404,
    description: 'The post doesnt exist',
  })
  async unlikePost(@Req() req, @Param('slug') slug) {
    return this.postsService.unlikePost(slug, req.user);
  }
}
