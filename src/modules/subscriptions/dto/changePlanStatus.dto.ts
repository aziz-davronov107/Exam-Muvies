import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ChangePlanStatusDto {
  @ApiProperty({
    example: true,
    description: 'Set to true to activate the plan, or false to deactivate it',
    default: true,
  })
  @IsBoolean()
  is_active: boolean;
}
