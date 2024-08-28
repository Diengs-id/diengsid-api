import { IsNotEmpty } from 'class-validator';

export class AuthGoogleDto {
  @IsNotEmpty()
  google_id: string;
  @IsNotEmpty()
  email: string;
}
