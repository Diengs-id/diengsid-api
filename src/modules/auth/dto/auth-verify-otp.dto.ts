import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthVerifyOtpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  otp: string;
}
