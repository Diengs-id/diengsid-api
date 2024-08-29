import { IsNotEmpty } from 'class-validator';

export class AuthRegisterGoogleDto {
  @IsNotEmpty()
  google_id: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  picture: string;
}
