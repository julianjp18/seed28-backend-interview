import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    it('POST /api/auth/login - returns 401 for invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'invalid@test.com', password: 'wrong' })
        .expect(401);
    });

    it('POST /api/auth/login - returns 400 when body is invalid', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'not-an-email', password: '' })
        .expect(400);
    });
  });

  describe('Bulls', () => {
    it('GET /api/bulls - returns 401 without token', () => {
      return request(app.getHttpServer()).get('/api/bulls').expect(401);
    });
  });
});
