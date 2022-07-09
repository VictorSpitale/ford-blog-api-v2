import { CategoriesService } from './categories.service';
import { CategoryDto } from './dto/category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto): Promise<CategoryDto>;
    getCategories(): Promise<CategoryDto[]>;
    getCategoryById(id: string): Promise<CategoryDto>;
    deleteCategory(id: string, req: any): Promise<void>;
}
