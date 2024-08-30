import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthLoginGoogleDto {
  @IsNotEmpty()
  google_id: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
