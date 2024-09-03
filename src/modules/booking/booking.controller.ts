import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '../../common/responses/api-response';
import { AuthGuard } from '../auth/auth.guard';
import { BookingService } from './booking.service';
import { BookingRequestDto } from './dto/homestay-request.dto';
import { BookingResponseDto } from './dto/homestay-response.dto';

@Controller('/api/bookings')
export class BookingController {
  @Inject()
  private readonly bookingService: BookingService;

  @UseGuards(AuthGuard)
  @Post('/')
  @HttpCode(200)
  async booking(
    @Request() req: any,
    @Body() bookingRequestDto: BookingRequestDto,
  ): Promise<ApiResponse<BookingResponseDto>> {
    const userId = req.user;
    const result = await this.bookingService.booking(bookingRequestDto, userId);
    return ApiResponse.success(result);
  }
}
