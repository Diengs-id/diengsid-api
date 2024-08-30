import { HttpException, Inject, Injectable } from '@nestjs/common';
import { UserServiceInterface } from './user-service.interface';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService implements UserServiceInterface {
  @Inject()
  private readonly prismaService: PrismaService;
  async get(email): Promise<UserResponseDto> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
      include: {
        customer: true,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return {
      id: user.id,
      email: user.email,
      google_id: user.google_id,
      name: user.customer.name,
    };
  }
}
