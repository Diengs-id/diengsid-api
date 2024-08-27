import { UserResponseDto } from './dto/user-response.dto';

export interface UserServiceInterface {
  get(email): Promise<UserResponseDto>;
}
