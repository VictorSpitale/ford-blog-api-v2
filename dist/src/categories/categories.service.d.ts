import { Category, CategoryDocument } from './entities/category.entity';
import { Model } from 'mongoose';
import { CategoryDto } from './dto/category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { MatchType } from '../shared/types/match.types';
import { PostsService } from '../posts/posts.service';
import { User } from '../users/entities/user.entity';
import { CategoryWithCountDto } from './dto/category-with-count.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesService {
    private readonly categoryModel;
    private readonly postsService;
    constructor(categoryModel: Model<CategoryDocument>, postsService: PostsService);
    create(createCategoryDto: CreateCategoryDto): Promise<CategoryDto>;
    private getCategoryByName;
    getCategories(): Promise<CategoryDto[]>;
    getCategoriesWithCount(): Promise<CategoryWithCountDto[]>;
    getCategoryById(id: string): Promise<CategoryDto>;
    updateCategory(updateCategoryDto: UpdateCategoryDto, categoryId: any): Promise<CategoryDto>;
    deleteCategory(id: string, authUser: User): Promise<void>;
    private find;
    findOne(match: MatchType): Promise<Category | null>;
    asDto(category: Category): CategoryDto;
}
