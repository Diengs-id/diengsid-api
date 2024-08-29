import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('User Controller', () => {
  let app: INestApplication;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    testService = app.get(TestService);
  });

  describe('POST /api/auth/register', () => {
    beforeEach(async () => {
      await testService.deleteUser();
    });

    it('should be reject if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: '',
          password: '',
          name: '',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
      expect(response.body.message).toBeDefined();
    });

    it('sholud be reject if user already exist', async () => {
      await testService.createUser();

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'test@test.com',
          password: 'test',
          name: 'test',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });

    it('sholud be able to register', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'test@test.com',
          password: 'test',
          name: 'test',
        });

      expect(response.status).toBe(201);
      expect(response.body.data).toBeDefined();
    });
  });
});
