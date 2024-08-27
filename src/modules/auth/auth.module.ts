import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';
import { AuthController } from "./auth.controller";

@Module({
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '60s',
      },
    }),
  ],
  providers: [
    {
      provide: 'AuthServiceInterface',
      useClass: AuthService,
    },
    AuthService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
