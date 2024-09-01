import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class HomestaySearchRequest {
  @IsOptional()
  name?: string;
  @IsOptional()
  description?: string;
  @IsOptional()
  destination?: string;
  @IsOptional()
  amenity?: string;
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  size: number = 10;
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page: number = 1;
}
