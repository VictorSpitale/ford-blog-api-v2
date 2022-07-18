import { CategoryDto } from './category.dto';
declare const CategoryWithCountDto_base: import("@nestjs/common").Type<Partial<CategoryDto>>;
export declare class CategoryWithCountDto extends CategoryWithCountDto_base {
    readonly count: number;
}
export {};
