import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import * as Mongoose from 'mongoose';

export class CategoryDto extends PickType(CreateCategoryDto, ['name']) {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({
    type: String,
    description: "Category's id",
    example: '61f59acf09f089c9df951c37',
  })
  readonly _id: Mongoose.Types.ObjectId;
}
