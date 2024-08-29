import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma/prisma.service';

@Injectable()
export class TestService {
  @Inject()
  private readonly prismaService: PrismaService;

  async deleteUser() {
    await this.prismaService.customer.deleteMany({
      where: {
        first_name: 'test',
      },
    });
    await this.prismaService.user.deleteMany({
      where: {
        email: 'test@test.com',
      },
    });
  }

  async createUser() {
    await this.prismaService.user.create({
      data: {
        email: 'test@test.com',
      },
    });
  }
}
