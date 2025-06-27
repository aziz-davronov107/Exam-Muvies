import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotDto {
  @ApiProperty({ default: 'testuser@gmail.com' })
  @IsEmail()
  email: string;
}
