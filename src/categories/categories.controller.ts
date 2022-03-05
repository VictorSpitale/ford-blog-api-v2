import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryDto } from './dto/category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

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
  @ApiResponse({ status: 400, description: 'Validations failed' })
  @ApiResponse({ status: 409, description: 'The category already exist' })
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryDto> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'List all categories',
    type: [CategoryDto],
  })
  async getCategories(): Promise<CategoryDto[]> {
    return this.categoriesService.getCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by id' })
  @ApiResponse({
    status: 200,
    description: 'Category founded',
    type: CategoryDto,
  })
  @ApiResponse({ status: 400, description: 'Id is not a valid id' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async getCategoryById(@Param('id') id: string) {
    return this.categoriesService.getCategoryById(id);
  }
}
