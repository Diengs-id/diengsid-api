import { Destination, Review } from '@prisma/client';

export class HomestayResponseDto {
  id: string;
  homestay_name: string;
  location: LocationResponseDto;
  description: string;
  main_image: string;
  total_rating?: number;
  image_homestay: [];
  amenities?: [];
  destinations?: Destination;
  reviews?: Review;
}

export class LocationResponseDto {
  latitude: number;
  longitude: number;
  address: string;
}
