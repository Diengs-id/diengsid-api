import { FirstPayment } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsNotEmpty } from 'class-validator';

export class BookingRequestDto {
  @IsNotEmpty()
  room_id: string;
  @IsEnum(FirstPayment)
  @IsNotEmpty()
  first_payment: FirstPayment;
  @IsNotEmpty()
  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  start_date: Date;
  @IsNotEmpty()
  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  end_date: Date;
  @IsInt()
  @IsNotEmpty()
  number_guest: number;
}
