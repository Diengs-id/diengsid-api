import { Paging } from '../../common/responses/api-response';
import { HomestaySearchRequest } from './dto/homestay-request.dto';
import { HomestayResponseDto } from './dto/homestay-response.dto';

export interface HomestayServiceInteface {
  search(
    homestaySearchRequest: HomestaySearchRequest,
  ): Promise<{ homestayResponseDto: HomestayResponseDto[]; paging: Paging }>;

  get(id: string): Promise<HomestayResponseDto>;
}
