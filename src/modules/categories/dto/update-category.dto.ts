import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ default: 'Jangari' })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: 'kelini izlab' })
  slug?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: 'qaynonan zapal qildi ' })
  description?: string;
}
