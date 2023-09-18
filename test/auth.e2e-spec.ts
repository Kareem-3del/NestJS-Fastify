import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth (GET)', async () => {
    await request(app.getHttpServer()).get('/auth').expect(401);
  });

  it('/auth/register (POST)', async () => {
    const registrationData = {
      name: 'test-user',
      password: 'test-password',
      email: `${Math.random().toString(36).substring(2, 15)}@example.com`,
    };
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registrationData)
      .expect(201); // Assuming the controller returns 201 for successful registration

    expect(response.body).toBeDefined(); // Assuming the controller returns a defined body
  });

  it('/auth/login (POST)', async () => {
    const registrationData = {
      name: 'test-user',
      password: 'test-password',
      email: `${Math.random().toString(36).substring(2, 15)}@example.com`,
    };
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(registrationData)
      .expect(201); // Assuming the controller returns 201 for successful registration

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(registrationData)
      .expect(201); // Assuming the controller returns 200 for successful login

    expect(response.body).toBeDefined(); // Assuming the controller returns a defined body
  });

  afterAll(async () => {
    await app.close();
  });
});
