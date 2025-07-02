import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { SUBSCRIPTION_TYPE } from '../../../core/types/enum.types';

export class GetAllMoviesDto {
  @ApiPropertyOptional({ description: 'Page raqami', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number;

  @ApiPropertyOptional({ description: 'Sahifada nechta element', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;

  @ApiPropertyOptional({ description: 'Kategoriya id' })
  @IsOptional()
  @IsString()
  category_id?: string;

  @ApiPropertyOptional({
    description: 'Search bo‘yicha qidiruv (masalan: qasoskorlar)',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Subscription turi',
    enum: SUBSCRIPTION_TYPE,
    default: SUBSCRIPTION_TYPE.FREE,
  })
  @IsOptional()
  @IsEnum(SUBSCRIPTION_TYPE)
  subscription_type?: SUBSCRIPTION_TYPE;
}
