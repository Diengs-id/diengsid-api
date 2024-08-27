import { IsNotEmpty } from 'class-validator';

export class AutoGoogleDto {
  @IsNotEmpty()
  google_id: string;
  @IsNotEmpty()
  email: string;
}
