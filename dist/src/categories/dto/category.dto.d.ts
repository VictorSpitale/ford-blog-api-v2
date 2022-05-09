import { CreateCategoryDto } from './create-category.dto';
import * as Mongoose from 'mongoose';
declare const CategoryDto_base: import("@nestjs/common").Type<Pick<CreateCategoryDto, "name">>;
export declare class CategoryDto extends CategoryDto_base {
    readonly _id: Mongoose.Types.ObjectId;
}
export {};
