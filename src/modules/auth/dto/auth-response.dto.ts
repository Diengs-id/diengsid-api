export class AuthResponseDto {
  id: string;
  name: string;
  email: string;
  token: string;
  google_id?: string;
  picture?: string;
}
