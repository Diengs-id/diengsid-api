import { HomestaySearchRequest } from './dto/homestay-request.dto';
import { HomestayResponseDto } from './dto/homestay-response.dto';
import { Paging } from '../../common/responses/api-response';

export interface HomestayServiceInteface {
  search(
    homestaySearchRequest: HomestaySearchRequest,
  ): Promise<{ homestayResponseDto: HomestayResponseDto[]; paging: Paging }>;
}
