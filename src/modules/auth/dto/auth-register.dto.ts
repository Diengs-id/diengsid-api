import { IsNotEmpty } from 'class-validator';

export class AuthRegisterDto {
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
}
