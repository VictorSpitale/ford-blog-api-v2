import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { LocalesTypes } from '../../shared/types/locales.types';

export class PasswordRecoveryDto {
  @ApiProperty({
    description: "User's email",
    example: 'John@Doe.fr',
    required: true,
    pattern: `/^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$/`,
    type: String,
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['fr', 'en'])
  @ApiProperty({
    description: "User's locale",
    examples: ['fr', 'en'],
  })
  readonly locale: LocalesTypes;
}
