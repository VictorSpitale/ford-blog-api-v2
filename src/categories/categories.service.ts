import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './entities/category.entity';
import { isValidObjectId, Model, Types } from 'mongoose';
import { CategoryDto } from './dto/category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { MatchType } from '../shared/types/match.types';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryDto> {
    if (await this.getCategoryByName(createCategoryDto.name)) {
      throw new ConflictException('category already exist');
    }
    const createdCategory = await this.categoryModel.create(createCategoryDto);
    return this.asDto(createdCategory);
  }

  private async getCategoryByName(name: string): Promise<CategoryDto> {
    const category = await this.findOne({ name });
    return category ? this.asDto(category) : null;
  }

  async getCategories(): Promise<CategoryDto[]> {
    const categories = await this.find();
    return categories.map((cat) => this.asDto(cat));
  }

  async getCategoryById(id: string): Promise<CategoryDto> {
    const category = await this.findOne({ _id: id });
    if (!category) throw new NotFoundException();
    return this.asDto(category);
  }

  private async find(match: MatchType = {}) {
    if (match._id) {
      if (!isValidObjectId(match._id)) {
        throw new BadRequestException();
      } else {
        match._id = new Types.ObjectId(match._id as string);
      }
    }
    return this.categoryModel.find(match, {
      _id: 1,
      name: 1,
    });
  }

  async findOne(match: MatchType): Promise<Category | null> {
    const category = await this.find(match);
    if (category.length > 0) {
      return category[0];
    } else {
      return null;
    }
  }

  asDto(category: Category): CategoryDto {
    return {
      _id: category._id,
      name: category.name,
    } as CategoryDto;
  }
}
