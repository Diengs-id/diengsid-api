import { HttpException, Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PaymentPayRequest } from './dto/payment-request.dto';
import { PaymentServiceInterface } from './payment-service.inteface';

@Injectable()
export class PaymentService implements PaymentServiceInterface {
  midtransBankTransfer(midtranOrderId: string, user: User, amount: number) {
    throw new Error('Method not implemented.');
  }
  @Inject()
  private readonly prismaService: PrismaService;

  pay(paymentPayRequest: PaymentPayRequest): PaymentResponse {
    // cek booking id
    const booking = this.prismaService.booking.findFirst({
      where: {
        id: paymentPayRequest.booking_id,
      },
    });

    // insert pay
    // this.prismaService.$transaction(async (prisma) => {});

    if (!booking) {
      throw new HttpException('Yah belum melakukan booking !!', 404);
    }

    return null;
  }
  callback(): PaymentResponse {
    throw new Error('Method not implemented.');
  }
}
