import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterGoogleDto } from './dto/auth-register-google.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthEmailVerifiedDto } from './dto/auth-email-verified.dto';
import { AuthVerifyOtpDto } from './dto/auth-verify-otp.dto';
import { AuthLoginGoogleDto } from './dto/auth.login-google.dto';

export interface AuthServiceInterface {
  register(authRegisterDto: AuthRegisterDto): Promise<AuthResponseDto>;
  registerGoogle(
    authRegisterGoogleDto: AuthRegisterGoogleDto,
  ): Promise<AuthResponseDto>;
  login(authLoginDto: AuthLoginDto): Promise<AuthResponseDto>;
  loginGoogle(authLoginGoogleDto: AuthLoginGoogleDto): Promise<AuthResponseDto>;
  emailVerified(email): Promise<boolean>;
  sendOtp(
    authEmailVerifiedDto: AuthEmailVerifiedDto,
  ): Promise<{ otp: string; expired_at: Date }>;
  verifyOtp(authVerifyOtp: AuthVerifyOtpDto): Promise<boolean>;
}
