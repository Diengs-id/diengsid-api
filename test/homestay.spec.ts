import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestModule } from './test.module';
import { TestService } from './test.service';

describe('Homestay Controller', () => {
  let app: INestApplication;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    testService = app.get(TestService);
  });

  describe('GET /api/homestays', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createHomestay();
    });
    it('should can search by name', async () => {
      const response = await request(app.getHttpServer()).get('/api/homestays');

      console.log(response.body);
    });
  });
});
