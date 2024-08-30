export class AuthResponseDto {
  id: number;
  name: string;
  email: string;
  token: string;
  google_id?: string;
  picture?: string;
}
