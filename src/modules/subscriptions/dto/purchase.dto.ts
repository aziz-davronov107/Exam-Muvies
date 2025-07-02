import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PurchaseDto {
  @ApiProperty({
    example: 'b945c2c9-e5cd-4768-ad22-2017a616008f',
    description: 'UUID of the subscription plan to purchase',
  })
  @IsString()
  @IsNotEmpty()
  plan_id: string;

  @ApiProperty({
    example: 'card',
    description: 'Payment method to use',
    enum: ['card', 'paypal', 'bank_transfer', 'crypto'] as const,
  })
  @IsString()
  @IsNotEmpty()
  payment_method: 'card' | 'paypal' | 'bank_transfer' | 'crypto';

  @ApiPropertyOptional({
    example: false,
    description: 'Whether the subscription should auto-renew',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  auto_renew: boolean = false;

  @ApiProperty({
    example: { card_number: '4111111111111111', expiry: '12/25', cvv: '123' },
    description: 'Additional details required by the payment gateway',
  })
  @IsNotEmpty()
  payment_details: any;
}
