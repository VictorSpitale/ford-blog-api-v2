import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: "Category's name",
    example: 'Sport',
    required: true,
    type: String,
    name: 'name',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
