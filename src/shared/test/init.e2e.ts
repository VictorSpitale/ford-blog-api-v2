import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AuthGuardMock } from './mocks/auth.guard.mock';
import { ValidationPipe } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { getRequest } from './superagent';
import * as request from 'supertest';
import { RolesGuard } from '../../auth/guards/roles.guard';
import * as cookieParser from 'cookie-parser';

export async function initE2eWithoutGuards() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(RolesGuard)
    .useClass(AuthGuardMock)
    .overrideProvider(JwtAuthGuard)
    .useClass(AuthGuardMock)
    .compile();

  return {
    ...(await getInitConst(moduleFixture)),
  };
}

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
  }).compile();

  return {
    ...(await getInitConst(moduleFixture)),
  };
}
