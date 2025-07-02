import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    default: 'Azizbek_Davronov',
  })
  @IsString()
  @IsOptional()
  full_name?: string;

  @ApiProperty({
    default: '+998905631170',
  })
  @IsString()
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({
    default: 'Uzbekistan',
  })
  @IsString()
  @IsOptional()
  country?: string;
}
