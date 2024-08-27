import { Controller, Get, Inject, Request, UseGuards } from '@nestjs/common';
import { ApiResponse } from '../../common/responses/api-response';
import { AuthGuard } from '../auth/auth.guard';
import { UserService } from './user.service';
import { UserResponseDto } from "./dto/user-response.dto";

@Controller('/api/users')
export class UserController {
  @Inject()
  private readonly userService: UserService;
  @UseGuards(AuthGuard)
  @Get('/current')
  async get(@Request() request): Promise<ApiResponse<UserResponseDto>> {
    const email = request.user.email;
    const result = await this.userService.get(email);
    return ApiResponse.success(result);
  }
}
