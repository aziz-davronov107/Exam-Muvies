import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { SUBSCRIPTION_TYPE } from 'src/core/types/enum.types';

export class UpdateMovieDto {
  @IsOptional()
  @ApiProperty({ default: 'Qasoskorlar 6' })
  @IsString()
  title?: string;

  @IsOptional()
  @ApiProperty({ default: 'Qasoskorlar Final' })
  @IsNotEmpty()
  @IsString()
  slug?: string;

  @IsOptional()
  @ApiProperty({ default: 'Qasoskorlar Kultaviy jangari,fantastika' })
  @IsString()
  description?: string;

  @IsOptional()
  @ApiProperty({ default: 2018 })
  @IsNumber()
  release_year?: number;

  @IsOptional()
  @ApiProperty({ default: 134 })
  @IsNumber()
  duration_minutes?: number;

  @IsOptional()
  @ApiProperty({ default: null })
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsEnum(SUBSCRIPTION_TYPE)
  subscription_type?: SUBSCRIPTION_TYPE;
}
