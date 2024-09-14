import { User } from '@prisma/client';
import { PaymentPayRequest } from './dto/payment-request.dto';

export interface PaymentServiceInterface {
  pay(paymentPayRequest: PaymentPayRequest): PaymentResponse;
  midtransBankTransfer(midtranOrderId: string, user: User, amount: number);
  callback(): PaymentResponse;
}
