import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Customer, User } from '@prisma/client';
import * as moment from 'moment';
import { PrismaService } from '../../common/prisma/prisma.service';
import { BookingServiceInterface } from './booking-service.interface';
import { BookingRequestDto } from './dto/homestay-request.dto';
import { BookingResponseDto } from './dto/homestay-response.dto';

@Injectable()
export class BookingService implements BookingServiceInterface {
  @Inject()
  private prismaService: PrismaService;

  async booking(
    bookingRequestDto: BookingRequestDto,
    user: User,
  ): Promise<BookingResponseDto> {
    // cek room
    const room = await this.checkRoom(bookingRequestDto.room_id);
    // cek phone number
    const customer = await this.checkCustomerAndPhone(user.id);
    // get durasi
    const duration = await this.getDuration(
      bookingRequestDto.start_date,
      bookingRequestDto.end_date,
    );

    // generate booking id
    const codeBooking = this.generateCodeBooking();

    // cek status booking
    const bookingStatusId = 1;
    this.checkStatusBooking(bookingStatusId);

    // get total
    const totalAmount = await this.countTotalAmout(room.price, duration);

    // cek number guest
    await this.checkNumberGuest(bookingRequestDto.number_guest, room.id);

    const booking = await this.prismaService.booking.create({
      data: {
        code_booking: codeBooking,
        duration: duration,
        start_date: bookingRequestDto.start_date,
        end_date: bookingRequestDto.start_date,
        total_amount: totalAmount,
        number_guest: bookingRequestDto.number_guest,
        customer: {
          connect: customer,
        },
        room: {
          connect: room,
        },
        booking_status: {
          connect: {
            id: bookingStatusId,
          },
        },
        first_payment: bookingRequestDto.first_payment,
      },
      include: {
        booking_status: true,
      },
    });

    return {
      id: booking.id,
      code_booking: booking.code_booking,
      booking_status: booking.booking_status.name,
      duraion: booking.duration,
      start_date: booking.start_date,
      end_date: booking.end_date,
      first_payment: booking.first_payment,
      number_guest: booking.number_guest,
      order_date: booking.created_at,
      total_amount: booking.total_amount,
    };
  }

  sendNotifiCustomer(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  sendNotifOwner(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  setStatusToCheckAvailable(): Promise<BookingResponseDto> {
    throw new Error('Method not implemented.');
  }
  setStatusToPayment(): Promise<BookingResponseDto> {
    throw new Error('Method not implemented.');
  }
  setStatusToNotAvailable(): Promise<BookingResponseDto> {
    throw new Error('Method not implemented.');
  }
  setStatusToCancel(): Promise<BookingResponseDto> {
    throw new Error('Method not implemented.');
  }
  setStatusToCheckIn(): Promise<BookingResponseDto> {
    throw new Error('Method not implemented.');
  }
  setStatusToGiveFeedBack(): Promise<BookingResponseDto> {
    throw new Error('Method not implemented.');
  }
  setStatusToDone(): Promise<BookingResponseDto> {
    throw new Error('Method not implemented.');
  }

  private async checkRoom(room_id: string) {
    const room = await this.prismaService.room.findFirst({
      where: {
        id: room_id,
      },
    });

    if (!room) {
      throw new HttpException(
        'Yah, homestay yang lo cari nggak ketemu nih. Coba cek lagi!',
        404,
      );
    }

    return room;
  }

  private async checkCustomerAndPhone(user_id: number): Promise<Customer> {
    return this.prismaService.customer.findFirst({
      where: {
        AND: [
          {
            user_id: user_id,
          },
          {
            phone: {
              not: null,
            },
          },
        ],
      },
    });
  }

  private async checkStatusBooking(status_booking_id: number) {
    const status_book = await this.prismaService.bookingStatus.findFirst({
      where: {
        id: status_booking_id,
      },
    });

    if (!status_book) {
      throw new HttpException(
        'Yoo! Belum isi nomor HP nih. Lengkapin dulu biar bookingnya lancar!',
        404,
      );
    }

    return status_book;
  }

  private async getDuration(startDate: Date, endDate: Date): Promise<number> {
    const start = moment(startDate);
    const end = moment(endDate);

    return end.diff(start, 'day');
  }

  private async countTotalAmout(price: number, duration: number) {
    return price * duration;
  }

  generateCodeBooking(): string {
    const month = moment().format('m');
    return `DID${month}${moment().unix()}`;
  }

  private async checkNumberGuest(numberGuest: number, room_id: string) {
    const room = await this.prismaService.room.findFirst({
      where: {
        id: room_id,
      },
    });

    if (numberGuest > room.capacity) {
      throw new HttpException(
        'Oops! Tamu kebanyakan nih, nggak muat cuy. Cek lagi ya!',
        400,
      );
    }
  }
}
