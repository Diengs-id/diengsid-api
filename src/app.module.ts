import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { HomestayModule } from './modules/homestay/homestay.module';
@Module({
  imports: [
    UserModule,
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HomestayModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
