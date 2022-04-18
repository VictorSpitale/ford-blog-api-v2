import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { ValidationPipe } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { getRequest } from './superagent';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { MailService } from '../../mail/mail.service';
import { MailServiceMock } from './mocks/mail.service.mock';

async function getInitConst(moduleFixture: TestingModule) {
  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  await app.init();
  const dbConnection = moduleFixture
    .get<DatabaseService>(DatabaseService)
    .getDbHandle();
  const httpServer = app.getHttpServer();
  const httpRequest = getRequest(request(httpServer));
  return {
    app,
    dbConnection,
    httpRequest,
    moduleFixture,
  };
}

export async function initE2eWithGuards() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(MailService)
    .useClass(MailServiceMock)
    .compile();

  return {
    ...(await getInitConst(moduleFixture)),
  };
}
