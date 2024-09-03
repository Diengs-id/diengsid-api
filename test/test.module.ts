import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TestService } from './test.service';

@Module({
  providers: [TestService],
  exports: [TestService],
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
})
export class TestModule {}
