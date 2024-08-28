import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthGoogleDto } from './dto/auth-google.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthEmailVerifiedDto } from './dto/auth-email-verified.dto';
import { AuthVerifyOtpDto } from "./dto/auth-verify-otp.dto";

export interface AuthServiceInterface {
  register(authRegisterDto: AuthRegisterDto): Promise<AuthResponseDto>;
  registerGoogle(authGoogleDto: AuthGoogleDto): Promise<AuthResponseDto>;
  login(authLoginDto: AuthLoginDto): Promise<AuthResponseDto>;
  loginGoogle(authGoogleDto: AuthGoogleDto): Promise<AuthResponseDto>;
  emailVerified(email): Promise<boolean>;
  sendOtp(authEmailVerifiedDto: AuthEmailVerifiedDto): Promise<string>;
  verifyOtp(authVerifyOtp: AuthVerifyOtpDto): Promise<boolean>;
}
