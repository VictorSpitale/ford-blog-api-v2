import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostDto } from './dto/post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { IUserRole } from '../users/entities/users.role.interface';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AllowAny } from '../auth/decorators/allow-any.decorator';

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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(IUserRole.POSTER)
  create(@Body() createPostDto: CreatePostDto): Promise<PostDto> {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'List all posts', type: [PostDto] })
  @AllowAny()
  async getPosts(@Req() req): Promise<PostDto[]> {
    return this.postsService.getPosts(req.user);
  }
}
