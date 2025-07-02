import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { SUBSCRIPTION_TYPE } from 'src/core/types/enum.types';

export class CreateMovieDto {
  @ApiProperty({ default: 'Qasoskorlar 5' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ default: 'Qasoskorlar Final' })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty({ default: 'Qasoskorlar Kultaviy jangari,fantastika' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ default: 2018 })
  @IsNotEmpty()
  @IsNumber()
  release_year: number;

  @ApiProperty({ default: 134 })
  @IsNumber()
  duration_minutes: number;

  @IsOptional()
  @IsEnum(SUBSCRIPTION_TYPE)
  subscription_type?: SUBSCRIPTION_TYPE;

  @IsNotEmpty()
  @IsString()
  created_by: string;

  @IsNotEmpty()
  @IsString()
  category_id: string;
}
