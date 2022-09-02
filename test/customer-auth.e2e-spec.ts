import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { Connection } from 'typeorm';
import { TokensService } from 'src/auth/services/tokens.service';
import { CustomersAuthController } from 'src/customers/controllers/customers-auth.controller';
import { CustomersService } from 'src/customers/services/customers.service';
import { TypeOrmHelpers } from './helpers/type-orm.helpers';
import * as mockData from './mock/customers.json';

describe('Customer Auth Controller (e2e)', () => {
  let app: INestApplication;
  let typeORMHelpers: TypeOrmHelpers;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CustomersAuthController],
      providers: [CustomersService, TokensService],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    const connection = moduleRef.get<Connection>(Connection);
    typeORMHelpers = new TypeOrmHelpers(connection);
  });

  it.each([
    [mockData.valid.loginPayload, HttpStatus.OK],
    [mockData.invalid.loginPayload, HttpStatus.BAD_REQUEST],
  ])(
    'Customers login - POST /auth/customers/login',
    async (payload, status) => {
      await request(app.getHttpServer())
        .post('/auth/customers/login')
        .send(payload)
        .expect(status);
    },
  );

  it.each([[mockData.valid.loginPayload, HttpStatus.OK]])(
    'Customer tokens refresh - POST /auth/customers/refresh-access-token',
    async (payload, status) => {
      const {
        body: {
          tokens: { refreshToken },
        },
      } = await request(app.getHttpServer())
        .post('/auth/customers/login')
        .send(payload)
        .expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .post('/auth/customers/refresh-access-token')
        .send({ refreshToken })
        .expect(status);
    },
  );

  it.each([
    [mockData.valid.signupPayload, HttpStatus.OK],
    [mockData.invalid.signupPayload, HttpStatus.BAD_REQUEST],
  ])(
    'Customer sign up - POST /auth/customers/registration',
    async (payload, status) => {
      await request(app.getHttpServer())
        .post('/auth/customers/registration')
        .send(payload)
        .expect(status);
    },
  );

  afterAll(async done => {
    await typeORMHelpers.closeConnection();
    await app.close();
    done();
  }, 90000);
});
