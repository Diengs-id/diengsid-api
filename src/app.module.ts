import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './common/email/email.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookingModule } from './modules/booking/booking.module';
import { HomestayModule } from './modules/homestay/homestay.module';
import { UserModule } from './modules/user/user.module';
@Module({
  imports: [
    UserModule,
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HomestayModule,
    EmailModule,
    BookingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
