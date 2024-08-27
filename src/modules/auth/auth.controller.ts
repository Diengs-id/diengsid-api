import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login.dto';
import { ApiResponse } from '../../common/responses/api-response';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AutoGoogleDto } from './dto/auto-google.dto';

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
  async registerGoogle(@Body() authGoogleDto: AutoGoogleDto): Promise<ApiResponse<AuthResponseDto>> {
    const result = await this.authService.registerGoogle(authGoogleDto);
    return ApiResponse.success(result, 'Register success');
  }

  @Post('/login/google')
  async loginGoogle(@Body() authGoogleDto: AutoGoogleDto): Promise<ApiResponse<AuthResponseDto>> {
    const result = await this.authService.loginGoogle(authGoogleDto);
    return ApiResponse.success(result, 'Login google success');
  }
}
