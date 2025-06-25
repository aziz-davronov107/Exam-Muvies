import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class VerifyDto {

  @ApiProperty({default:"testuser@gmail.com"})
  @IsEmail()
  email: string;

  @ApiProperty({default:"ali123"})
  @IsNotEmpty()
  @IsNumber()
  @Min(100000)
  @Max(999999)
  code: number;

  @IsIn(['register', 'forgot'])
  type: 'register' | 'forgot';

  @IsOptional()
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^[a-zA-Z0-9]{6,20}$/)
  @MaxLength(20)
  newPassword?: string;
}

