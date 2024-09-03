export class BookingResponseDto {
  id: string;
  code_booking: string;
  first_payment: string;
  start_date: Date;
  end_date: Date;
  number_guest: number;
  duraion: number;
  total_amount: number;
  booking_status: string;
  order_date: Date;
}
