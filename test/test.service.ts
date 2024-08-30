import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  @Inject()
  private readonly prismaService: PrismaService;

  async deleteUser(
    name: string = 'test-name',
    email: string = 'test@test.com',
  ) {
    await this.prismaService.customer.deleteMany({
      where: {
        customer_name: name,
      },
    });
    await this.prismaService.user.deleteMany({
      where: {
        email: email,
      },
    });

    await this.prismaService.verificationCode.deleteMany({
      where: {
        email: email,
      },
    });
  }

  async createUser(email: string = 'test@test.com') {
    await this.prismaService.user.create({
      data: {
        email: email,
        password: await bcrypt.hash('test-password', 10),
        google_id: 'test-google-id',
        customer: {
          create: {
            customer_name: 'test-name',
          },
        },
      },
    });
  }

  async createVerificationCode(
    email = 'test@test.com',
    is_email_verified = true,
  ) {
    await this.prismaService.verificationCode.create({
      data: {
        email: email,
        is_email_verified: is_email_verified,
        otp: 'test-otp',
      },
    });
  }
}
