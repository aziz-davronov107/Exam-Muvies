import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Jangari' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Qaynota kelin' })
  slug: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'qaynonan zapal qildi ' })
  description: string;
}
