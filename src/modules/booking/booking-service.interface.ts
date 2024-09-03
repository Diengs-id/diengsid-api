import { User } from '@prisma/client';
import { BookingRequestDto } from './dto/homestay-request.dto';
import { BookingResponseDto } from './dto/homestay-response.dto';

export interface BookingServiceInterface {
  booking(
    bookingRequestDto: BookingRequestDto,
    user: User,
  ): Promise<BookingResponseDto>;
  generateCodeBooking(): string;
  sendNotifiCustomer(): Promise<boolean>;
  sendNotifOwner(): Promise<boolean>;
  setStatusToCheckAvailable(): Promise<BookingResponseDto>;
  setStatusToPayment(): Promise<BookingResponseDto>;
  setStatusToNotAvailable(): Promise<BookingResponseDto>;
  setStatusToCancel(): Promise<BookingResponseDto>;
  setStatusToCheckIn(): Promise<BookingResponseDto>;
  setStatusToGiveFeedBack(): Promise<BookingResponseDto>;
  setStatusToDone(): Promise<BookingResponseDto>;
}
