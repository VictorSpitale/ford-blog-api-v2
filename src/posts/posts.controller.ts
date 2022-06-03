import {
  Body,
  Controller,
  Delete,
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
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
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
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatedPostDto } from './dto/paginated-post.dto';
import { HttpErrorDto, HttpValidationError } from '../shared/error/HttpError';
import { BasicPostDto } from './dto/basic-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { DeleteCommentDto } from './dto/delete-comment.dto';

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
  @ApiResponse({
    status: 400,
    description: 'Validations failed',
    type: HttpValidationError,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
    type: HttpErrorDto,
  })
  @ApiResponse({
    status: 409,
    description: 'A post with this slug already exist',
    type: HttpErrorDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  @Role(IUserRole.POSTER)
  @ApiCookieAuth()
  create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<PostDto> {
    return this.postsService.create(createPostDto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all/paginated posts' })
  @ApiResponse({
    status: 200,
    description: 'List all posts',
    type: PaginatedPostDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Jwt failed',
    type: HttpErrorDto,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'Page to fetch, 3 items per page',
    required: false,
  })
  @ApiCookieAuth()
  async getPosts(@Req() req, @Query('page') page) {
    return this.postsService.getPosts(req.user, page);
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
  @ApiOperation({ summary: 'Query posts' })
  @ApiQuery({ name: 'search', type: String, example: 'puma' })
  @ApiResponse({
    status: 200,
    description: 'List the 5 queried posts',
    type: [PostDto],
  })
  @ApiResponse({
    status: 400,
    description:
      'Search query failed, search must be defined and more than 2 characters',
    type: HttpErrorDto,
  })
  @AllowAny()
  async getQueriedPosts(@Query('search') search) {
    return this.postsService.getQueriedPosts(search);
  }

  @Get('liked/:id')
  @ApiOperation({ summary: 'Get posts liked by the user' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User id',
  })
  @ApiResponse({
    status: 200,
    description: 'Posts list',
    type: [BasicPostDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Jwt failed | Insufficient permissions',
    type: HttpErrorDto,
  })
  @ApiCookieAuth()
  async getLikedPost(@Req() req, @Param('id') id) {
    return this.postsService.getLikedPosts(id, req.user);
  }

  @Get(':slug')
  @AllowAny()
  @ApiOperation({ summary: 'Get post by slug' })
  @ApiResponse({
    status: 200,
    description: 'The post got by its slug',
    type: PostDto,
  })
  @ApiResponse({
    status: 404,
    description: 'The post doesnt exist',
    type: HttpErrorDto,
  })
  @ApiParam({
    description: "Post's slug to query",
    name: 'slug',
    example: 'que-penser-de-la-ford-focus-st-line',
    required: true,
    type: String,
  })
  async getPost(@Req() req, @Param('slug') slug): Promise<PostDto> {
    return this.postsService.getPost(slug, req.user);
  }

  @Patch('/like/:slug')
  @ApiOperation({ summary: 'Like a post' })
  @ApiParam({
    name: 'slug',
    description: 'Post slug',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The post has been liked, return the number of likes',
    type: Number,
  })
  @ApiResponse({
    status: 401,
    description: 'Jwt failed',
    type: HttpErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'The post doesnt exist',
    type: HttpErrorDto,
  })
  @ApiCookieAuth()
  async likePost(@Req() req, @Param('slug') slug) {
    return this.postsService.likePost(slug, req.user);
  }

  @Patch('/unlike/:slug')
  @ApiOperation({ summary: 'Unlike a post' })
  @ApiParam({
    name: 'slug',
    description: 'Post slug',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The post has been unliked, return the number of likes',
    type: Number,
  })
  @ApiResponse({
    status: 401,
    description: 'Jwt failed',
    type: HttpErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'The post doesnt exist',
    type: HttpErrorDto,
  })
  @ApiCookieAuth()
  async unlikePost(@Req() req, @Param('slug') slug) {
    return this.postsService.unlikePost(slug, req.user);
  }

  @Delete(':slug')
  @Role(IUserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a post' })
  @ApiParam({
    name: 'slug',
    description: 'Post slug',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The post has been deleted',
  })
  @ApiResponse({
    status: 401,
    description: 'Jwt failed | Insufficient permissions',
    type: HttpErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'The post doesnt exist',
    type: HttpErrorDto,
  })
  @ApiCookieAuth()
  async deletePost(@Req() req, @Param('slug') slug) {
    return this.postsService.deletePost(slug, req.user);
  }

  @Patch(':slug')
  @Role(IUserRole.ADMIN)
  @ApiOperation({ summary: 'Update a post' })
  @ApiParam({
    type: String,
    name: 'slug',
    description: 'Post slug',
  })
  @ApiResponse({
    status: 201,
    description: 'The post has been updated',
    type: PostDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validations failed',
    type: HttpValidationError,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
    type: HttpErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'The post doesnt exist',
    type: HttpErrorDto,
  })
  @ApiCookieAuth()
  async updatePost(
    @Req() req,
    @Body() updatePostDto: UpdatePostDto,
    @Param('slug') slug,
  ) {
    return this.postsService.updatePost(slug, updatePostDto, req.user);
  }

  @Post('/comment/:slug')
  @ApiOperation({ summary: 'Comment a post' })
  @ApiParam({
    type: String,
    name: 'slug',
    description: 'Post slug',
  })
  @ApiResponse({
    status: 201,
    description: 'The post has been commented',
    type: PostDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validations failed',
    type: HttpValidationError,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
    type: HttpErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'The post doesnt exist',
    type: HttpErrorDto,
  })
  @ApiCookieAuth()
  async commentPost(
    @Req() req,
    @Body() comment: CreateCommentDto,
    @Param('slug') slug,
  ) {
    return this.postsService.commentPost(req.user, comment, slug);
  }

  @Patch('/comment/:slug')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiParam({
    type: String,
    name: 'slug',
    description: 'Post slug',
  })
  @ApiResponse({
    status: 201,
    description: 'The updated post',
    type: PostDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validations failed',
    type: HttpValidationError,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
    type: HttpErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'The post doesnt exist',
    type: HttpErrorDto,
  })
  @ApiCookieAuth()
  async editPostComment(
    @Req() req,
    @Body() comment: UpdateCommentDto,
    @Param('slug') slug,
  ) {
    return this.postsService.updatePostComment(req.user, slug, comment);
  }

  @Delete('/comment/:slug')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({
    type: String,
    name: 'slug',
    description: 'Post slug',
  })
  @ApiResponse({
    status: 201,
    description: 'The updated post',
    type: PostDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validations failed',
    type: HttpValidationError,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
    type: HttpErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'The post doesnt exist',
    type: HttpErrorDto,
  })
  @ApiCookieAuth()
  async deletePostComment(
    @Req() req,
    @Param('slug') slug,
    @Body() commentDto: DeleteCommentDto,
  ) {
    return this.postsService.deletePostComment(req.user, slug, commentDto);
  }

  @Get('/isLiked/:slug')
  @ApiOperation({ summary: 'Send the auth like status of a post' })
  @ApiResponse({
    status: 200,
    description: 'The like status',
    type: Boolean,
  })
  @ApiParam({
    type: String,
    name: 'slug',
    description: 'Post slug',
  })
  @ApiCookieAuth()
  async patchLikePost(@Param('slug') slug: string, @Req() req) {
    return this.postsService.getPostLikeStatus(slug, req.user);
  }
}
