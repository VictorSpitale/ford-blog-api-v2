import { CategoryDto } from './category.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CategoryWithCountDto extends CategoryDto {
  @ApiProperty({
    description: 'Number of related posts',
    example: '12',
    type: Number,
  })
  @IsNumber()
  readonly count: number;
}
