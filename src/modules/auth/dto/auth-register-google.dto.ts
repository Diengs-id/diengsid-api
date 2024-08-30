import { IsEmail, IsNotEmpty } from "class-validator";

export class AuthRegisterGoogleDto {
  @IsNotEmpty()
  google_id: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  picture: string;
}
