import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as moment from 'moment';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestModule } from './test.module';
import { TestService } from './test.service';

describe('Booking Controller', () => {
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

  describe('POST /api/bookings', () => {
    afterEach(async () => {
      await testService.deleteAll();
    });
    it('should can search by name', async () => {
      const room = await testService.createRoom();
      const user = await testService.createUser('email@mail.com');
      const token = await testService.generateToken(user.email);

      const response = await request(app.getHttpServer())
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          room_id: room.id,
          first_payment: 'dp',
          start_date: moment().toDate(),
          end_date: moment().add(2, 'day').toDate(),
          number_guest: 10,
        });

      console.log(response.body);
      expect(response.status).toBe(200);
      // console.log(response.body);
    });
  });
});
