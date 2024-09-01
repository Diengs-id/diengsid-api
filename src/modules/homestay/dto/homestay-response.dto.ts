export class HomestayResponseDto {
  id: string;
  homestay_name: string;
  location: LocationResponseDto;
  description: string;
  main_image: string;
  rating: number;
}

export class LocationResponseDto {
  latitude: number;
  longitude: number;
  address: string;
}