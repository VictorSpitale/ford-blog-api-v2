import { CategoriesService } from './categories.service';
import { CategoryDto } from './dto/category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryWithCountDto } from './dto/category-with-count.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto): Promise<CategoryDto>;
    getCategories(): Promise<CategoryDto[]>;
    getCategoriesWithCount(): Promise<CategoryWithCountDto[]>;
    getCategoryById(id: string): Promise<CategoryDto>;
    updateCategory(id: string, updateCategory: UpdateCategoryDto): Promise<CategoryDto>;
    deleteCategory(id: string, req: any): Promise<void>;
}
