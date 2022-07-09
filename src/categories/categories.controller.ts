import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CategoryDto } from './dto/category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Role } from '../auth/decorators/roles.decorator';
import { IUserRole } from '../users/entities/users.role.interface';
import { AllowAny } from '../auth/decorators/allow-any.decorator';
import { HttpErrorDto, HttpValidationError } from '../shared/error/HttpError';

@Controller('categories')
@ApiTags('Categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a category' })
  @ApiResponse({
    status: 201,
    description: 'The category has been created',
    type: CategoryDto,
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
  @ApiResponse({
    status: 409,
    description: 'The category already exist',
    type: HttpErrorDto,
  })
  @Role(IUserRole.ADMIN)
  @ApiCookieAuth()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryDto> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'List all categories',
    type: [CategoryDto],
  })
  @AllowAny()
  async getCategories(): Promise<CategoryDto[]> {
    return this.categoriesService.getCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by id' })
  @ApiResponse({
    status: 200,
    description: 'Category found',
    type: CategoryDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Id is not a valid id',
    type: HttpErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
    type: HttpErrorDto,
  })
  @AllowAny()
  async getCategoryById(@Param('id') id: string) {
    return this.categoriesService.getCategoryById(id);
  }

  @Delete(':id')
  @Role(IUserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a category' })
  @ApiParam({
    name: 'id',
    description: 'Category slug',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The category has been deleted',
  })
  @ApiResponse({
    status: 401,
    description: 'Jwt failed | Insufficient permissions',
    type: HttpErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'The category doesnt exist',
    type: HttpErrorDto,
  })
  @ApiCookieAuth()
  async deleteCategory(@Param('id') id: string, @Req() req) {
    return this.categoriesService.deleteCategory(id, req.user);
  }
}
