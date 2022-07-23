import { PickType } from '@nestjs/swagger';
import { CategoryDto } from './category.dto';

export class UpdateCategoryDto extends PickType(CategoryDto, ['name']) {}
