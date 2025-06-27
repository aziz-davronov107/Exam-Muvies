import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ default: 'Toni' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ default: 'testuser@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ default: 'ali123' })
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^[a-zA-Z0-9]{6,20}$/)
  @MaxLength(20)
  password: string;
}
