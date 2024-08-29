import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login.dto';
import { ApiResponse } from '../../common/responses/api-response';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthRegisterGoogleDto } from './dto/auth-register-google.dto';
import { AuthEmailVerifiedDto } from './dto/auth-email-verified.dto';
import { AuthVerifyOtpDto } from './dto/auth-verify-otp.dto';

@Controller('/api/auth')
export class AuthController {
  @Inject()
  private readonly authService: AuthService;
  @Post('/login')
  async login(
    @Body() authLoginDto: AuthLoginDto,
  ): Promise<ApiResponse<AuthResponseDto>> {
    const result = await this.authService.login(authLoginDto);
    return ApiResponse.success(result, 'Login success');
  }

  @Post('/register')
  async register(
    @Body() authRegsterDto: AuthRegisterDto,
  ): Promise<ApiResponse<AuthResponseDto>> {
    const result = await this.authService.register(authRegsterDto);
    return ApiResponse.success(result, 'Register success');
  }

  @Post('/register/google')
  async registerGoogle(
    @Body() authGoogleDto: AuthRegisterGoogleDto,
  ): Promise<ApiResponse<AuthResponseDto>> {
    const result = await this.authService.registerGoogle(authGoogleDto);
    return ApiResponse.success(result, 'Register success');
  }

  @Post('/login/google')
  async loginGoogle(
    @Body() authGoogleDto: AuthRegisterGoogleDto,
  ): Promise<ApiResponse<AuthResponseDto>> {
    const result = await this.authService.loginGoogle(authGoogleDto);
    return ApiResponse.success(result, 'Login google success');
  }

  @Post('/email-verified')
  async emailVerified(
    @Body() authEmailVerifiedDto: AuthEmailVerifiedDto,
  ): Promise<ApiResponse<any>> {
    const result = await this.authService.emailVerified(
      authEmailVerifiedDto.email,
    );
    return ApiResponse.success({ verified: result }, 'Email verified');
  }

  @Post('/send-otp')
  async sendOtp(
    @Body() authEmailVerifiedDto: AuthEmailVerifiedDto,
  ): Promise<ApiResponse<any>> {
    const result = await this.authService.sendOtp(authEmailVerifiedDto);
    return ApiResponse.success(
      { email: authEmailVerifiedDto.email, otp: result },
      'OTP Sended',
    );
  }

  @Post('/verify-otp')
  async verifyOtp(
    @Body() authVerifyOtpDto: AuthVerifyOtpDto,
  ): Promise<ApiResponse<any>> {
    const result = await this.authService.verifyOtp(authVerifyOtpDto);
    return ApiResponse.success(
      { email: authVerifyOtpDto.email, success: result },
      'OTP Verified',
    );
  }
}
