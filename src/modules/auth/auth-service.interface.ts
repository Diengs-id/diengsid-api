import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AutoGoogleDto } from './dto/auto-google.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';

export interface AuthServiceInterface {
  register(authRegisterDto: AuthRegisterDto): Promise<AuthResponseDto>;
  registerGoogle(authGoogleDto: AutoGoogleDto): Promise<AuthResponseDto>;
  login(authLoginDto: AuthLoginDto): Promise<AuthResponseDto>;
  loginGoogle(authGoogleDto: AutoGoogleDto): Promise<AuthResponseDto>;
}
