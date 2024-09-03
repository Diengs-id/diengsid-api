import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestModule } from './test.module';
import { TestService } from './test.service';

describe('Auth Controller', () => {
  let app: INestApplication;
  let testService: TestService;

  afterEach(async () => {
    await testService.deleteAll();
  });

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
    afterEach(async () => {
      await testService.deleteAll();
    });

    it('should be reject if request is invalid', async () => {
      const requests = [
        { email: '', password: 'test', name: 'test' },
        { email: 'test', google_id: '', name: 'test' },
        { email: 'test', google_id: 'test', name: '' },
        { email: 'test', google_id: 'test', name: 'test' }, //email must email format
      ];
      for (const req of requests) {
        const response = await request(app.getHttpServer())
          .post('/api/auth/register')
          .send(req);

        expect(response.status).toBe(400);
        expect(response.body.data).toBeUndefined();
        expect(response.body.message).toBeDefined();
        expect(response.body.error).toBeDefined();
      }
    });

    it('sholud be reject if user already exist', async () => {
      await testService.createUser();

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'test@test.com',
          password: 'test-password',
          name: 'test-name',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });

    it('should be reject if email is not verifiesd', async () => {
      const email = 'test@test.com';
      const isemailverified = false;
      await testService.createVerificationCode(email, isemailverified);

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: email,
          password: 'test-password',
          name: 'test-name',
        });
      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
      expect(response.body.data).toBeUndefined();
    });

    it('sholud be able to register', async () => {
      const email = 'test@test.com';
      const isemailverified = true;
      await testService.createVerificationCode(email, isemailverified);
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: email,
          password: 'test-password',
          name: 'test-name',
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.token).toBeDefined();
    });
  });

  describe('POST /api/auth/register/google', () => {
    afterEach(async () => {
      await testService.deleteAll();
    });

    it('should be reject if request is invalid', async () => {
      const requests = [
        { email: '', google_id: 'test', name: 'test', picture: 'test' },
        { email: 'test', google_id: '', name: 'test', picture: 'test' },
        { email: 'test', google_id: 'test', name: '', picture: 'test' },
        { email: 'test', google_id: 'test', name: 'test', picture: '' },
        { email: 'test', google_id: 'test', name: 'test', picture: 'test' }, //email must email format
      ];

      for (const req of requests) {
        const response = await request(app.getHttpServer())
          .post('/api/auth/register/google')
          .send(req);

        expect(response.status).toBe(400);
        expect(response.body.data).toBeUndefined();
        expect(response.body.message).toBeDefined();
        expect(response.body.error).toBeDefined();
      }
    });

    it('should be reject if user already exist', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/auth/register/google')
        .send({
          email: 'test@test.com',
          google_id: 'test',
          name: 'test',
          picture: 'test',
        });

      expect(response.status).toBe(400);
      expect(response.body.data).toBeUndefined();
      expect(response.body.message).toBeDefined();
    });

    it('should be able to register by google id', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register/google')
        .send({
          email: 'test@test.com',
          name: 'test-name',
          google_id: 'test-google-id',
          picture: 'test-picture',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.email).toBe('test@test.com');
      expect(response.body.data.name).toBe('test-name');
      expect(response.body.data.google_id).toBe('test-google-id');
      expect(response.body.data.picture).toBe('test-picture');
      expect(response.body.data.token).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    afterEach(async () => {
      await testService.deleteAll();
    });

    it('should be reject if request is invalid', async () => {
      const requests = [
        { email: '', password: 'test-password' },
        { email: 'test@test.com', password: '' },
        { email: 'test', password: 'tesr' },
      ];

      for (const req of requests) {
        const response = await request(app.getHttpServer())
          .post('/api/auth/login')
          .send(req);

        expect(response.status).toBe(400);
        expect(response.body.message).toBeDefined();
        expect(response.body.data).toBeUndefined();
        expect(response.body.error).toBeDefined();
      }
    });

    it('sholud reject if username or password invalid', async () => {
      await testService.createUser();

      const requests = [
        { email: 'email@salah.com', password: 'test-password' },
        { email: 'test@test.com', password: 'salah-password' },
      ];

      for (const req of requests) {
        const response = await request(app.getHttpServer())
          .post('/api/auth/login')
          .send(req);

        expect(response.status).toBe(401);
        expect(response.body.message).toBeDefined();
      }
    });

    it('should be login', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          password: 'test-password',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.email).toBe('test@test.com');
      expect(response.body.data.name).toBe('test-name');
      expect(response.body.data.token).toBeDefined();
    });
  });

  describe('POST /api/auth/login/google', () => {
    afterEach(async () => {
      await testService.deleteAll();
    });

    it('should be reject if request is invalid', async () => {
      const requests = [
        { email: '', google_id: 'test-password' },
        { email: 'test@test.com', google_id: '' },
        { email: 'test', google_id: 'test' },
      ];

      for (const req of requests) {
        const response = await request(app.getHttpServer())
          .post('/api/auth/login/google')
          .send(req);

        expect(response.status).toBe(400);
        expect(response.body.message).toBeDefined();
        expect(response.body.data).toBeUndefined();
        expect(response.body.error).toBeDefined();
      }
    });

    it('sholud reject if email not registered', async () => {
      await testService.createUser();

      const requests = [
        { email: 'email@salah.com', google_id: 'test-google-id' },
        { email: 'test@test.com', google_id: 'salah-google-id' },
      ];

      for (const req of requests) {
        const response = await request(app.getHttpServer())
          .post('/api/auth/login/google')
          .send(req);

        expect(response.status).toBe(401);
        expect(response.body.message).toBeDefined();
      }
    });

    it('should be login', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/auth/login/google')
        .send({
          email: 'test@test.com',
          google_id: 'test-google-id',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.email).toBe('test@test.com');
      expect(response.body.data.name).toBe('test-name');
      expect(response.body.data.token).toBeDefined();
    });
  });

  describe('POST /api/auth/email-verify', () => {
    afterEach(async () => {
      await testService.deleteAll();
    });

    it('should be reject if email already registered', async () => {
      await testService.createUser();

      const response = await request(app.getHttpServer())
        .post('/api/auth/email-verify')
        .send({
          email: 'test@test.com',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });

    it('should be verified', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/email-verify')
        .send({
          email: 'test@test.com',
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.email).toBe('test@test.com');
      expect(response.body.data.verified).toBe(true);
    });
  });

  // describe('POST /api/auth/send-otp', () => {
  //   beforeEach(async () => {
  //     await testService.deleteAll();
  //   });

  //   it('sholud be reject if request invalid', async () => {
  //     const response = await request(app.getHttpServer())
  //       .post('/api/auth/send-otp')
  //       .send({
  //         email: '',
  //       });

  //     expect(response.status).toBe(400);
  //     expect(response.body.message).toBeDefined();
  //   });

  //   it('should be send otp', async () => {
  //     const response = await request(app.getHttpServer())
  //       .post('/api/auth/send-otp')
  //       .send({
  //         email: 'test@test.com',
  //       });

  //     expect(response.status).toBe(200);
  //     expect(response.body.data.otp).toBeDefined();
  //     expect(response.body.data.expired_at).toBeDefined();
  //   });
  // });
  //
  // describe('POST /api/auth/verify-otp', () => {});
});
