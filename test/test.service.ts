import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../src/common/prisma/prisma.service';

@Injectable()
export class TestService {
  @Inject()
  private readonly prismaService: PrismaService;

  async deleteAll() {
    // await this.deleteCustomer();
    // await this.deleteUser();
    // await this.deleteverificationCode();
    // await this.deleteHomestay();
  }
  async deleteUser() {
    await this.prismaService.user.deleteMany({});
  }
  async deleteCustomer() {
    await this.prismaService.customer.deleteMany({});
  }
  async deleteverificationCode() {
    await this.prismaService.verificationCode.deleteMany({});
  }
  async deleteHomestay() {
    await this.prismaService.homestay.deleteMany({});
  }

  async deleteDestination() {
    await this.prismaService.destination.deleteMany({});
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

  async createHomestay() {
    await this.prismaService.homestay.create({
      data: {
        homestay_name: 'test-homestay-name',
        description: 'test-description',
        location: {
          create: {
            latitude: 10.0,
            longitude: 10.0,
            address: 'test-address',
          },
        },
        main_image: 'test-main-image',
        phone: 'test-phone',
        owner: 'test-owner',
        destinations: {
          create: [
            {
              distance: 100,
              destination: {
                create: {
                  destination_name: 'test-destination-name',
                  description: 'test-description-des',
                  location: {
                    create: {
                      address: 'test-loc-address',
                      longitude: 10,
                      latitude: 10,
                    },
                  },
                },
              },
            },
          ],
        },
        review: {
          create: [
            {
              rating: 5,
              comment: 'Hai',
              user: {
                create: {
                  email: 'test@maffl.cdd',
                  google_id: 'tesy',
                },
              },
            },
          ],
        },
      },
    });
  }
}
