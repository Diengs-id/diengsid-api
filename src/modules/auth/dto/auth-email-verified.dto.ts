import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthEmailVerifiedDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
