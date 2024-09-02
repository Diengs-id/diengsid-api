import { Module } from '@nestjs/common';
import { TestModule } from 'test/test.module';
import { HomestayController } from './homestay.controller';
import { HomestayService } from './homestay.service';

@Module({
  imports: [TestModule],
  providers: [HomestayService],
  controllers: [HomestayController],
})
export class HomestayModule {}
