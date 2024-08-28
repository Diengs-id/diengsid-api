import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { HomestayModule } from './modules/homestay/homestay.module';
import { EmailModule } from './common/email/email.module';
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
