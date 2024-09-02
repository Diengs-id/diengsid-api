export class HomestayResponseDto {
  id: string;
  homestay_name: string;
  location: LocationResponseDto;
  description: string;
  main_image: string;
  rating: number;
  image_homestay: [];
}

export class LocationResponseDto {
  latitude: number;
  longitude: number;
  address: string;
}
