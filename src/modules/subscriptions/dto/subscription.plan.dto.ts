import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionPlanDto {
  @ApiProperty({
    example: 'Basic',
    description: 'Name of the subscription plan',
  })
  @Length(1, 50)
  @IsString()
  name: string;

  @ApiProperty({ example: 49.99, description: 'Price of the plan' })
  @Max(99999999)
  @Min(0)
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 30,
    description: 'Duration in days (default is 0)',
    default: 0,
    required: false,
  })
  @Min(0)
  @IsNumber()
  @IsOptional()
  duration_days: number = 0;

  @ApiProperty({
    example: ['feature A', 'feature B'],
    description: 'List of plan features (as JSON)',
  })
  @IsNotEmpty()
  features: any;

  @ApiProperty({
    example: true,
    description: 'Is plan active? (default is true)',
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_active: boolean = true;
}
