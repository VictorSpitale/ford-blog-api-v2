import { Category, CategoryDocument } from './entities/category.entity';
import { Model } from 'mongoose';
import { CategoryDto } from './dto/category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { MatchType } from '../shared/types/match.types';
export declare class CategoriesService {
    private readonly categoryModel;
    constructor(categoryModel: Model<CategoryDocument>);
    create(createCategoryDto: CreateCategoryDto): Promise<CategoryDto>;
    private getCategoryByName;
    getCategories(): Promise<CategoryDto[]>;
    getCategoryById(id: string): Promise<CategoryDto>;
    private find;
    findOne(match: MatchType): Promise<Category | null>;
    asDto(category: Category): CategoryDto;
}
