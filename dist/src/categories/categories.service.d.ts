import { Category, CategoryDocument } from './entities/category.entity';
import { Model } from 'mongoose';
import { CategoryDto } from './dto/category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { MatchType } from '../shared/types/match.types';
import { PostsService } from '../posts/posts.service';
import { User } from '../users/entities/user.entity';
export declare class CategoriesService {
    private readonly categoryModel;
    private readonly postsService;
    constructor(categoryModel: Model<CategoryDocument>, postsService: PostsService);
    create(createCategoryDto: CreateCategoryDto): Promise<CategoryDto>;
    private getCategoryByName;
    getCategories(): Promise<CategoryDto[]>;
    getCategoryById(id: string): Promise<CategoryDto>;
    deleteCategory(id: string, authUser: User): Promise<void>;
    private find;
    findOne(match: MatchType): Promise<Category | null>;
    asDto(category: Category): CategoryDto;
}
