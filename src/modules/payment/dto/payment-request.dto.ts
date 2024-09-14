import { PaymentMethod, PaymentType } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class PaymentPayRequest {
  @IsNotEmpty()
  booking_id: string;
  @IsNotEmpty()
  user_id: string;
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;
  @IsNotEmpty()
  @IsEnum(PaymentType)
  payment_type: PaymentType;
}
