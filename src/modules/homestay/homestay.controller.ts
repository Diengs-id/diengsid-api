import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiResponse } from '../../common/responses/api-response';
import { HomestaySearchRequest } from './dto/homestay-request.dto';
import { HomestayService } from './homestay.service';

@Controller('/api/homestays')
export class HomestayController {
  @Inject()
  private readonly homestayService: HomestayService;

  @Get('/')
  async search(@Query() request: HomestaySearchRequest) {
    const result = await this.homestayService.search(request);
    return ApiResponse.successWithPaging(
      result.homestayResponseDto,
      result.paging,
    );
  }
}
