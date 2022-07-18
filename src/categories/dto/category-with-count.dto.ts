import { CategoryDto } from './category.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CategoryWithCountDto extends PartialType(CategoryDto) {
  @ApiProperty({
    description: 'Number of related posts',
    example: '12',
    type: Number,
  })
  @IsNumber()
  readonly count: number;
}
