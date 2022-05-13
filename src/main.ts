import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

const whitelist = ['http://localhost:3000', 'http://localhost:5000'];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Ford Blog API v2')
    .setDescription('The Ford Blog API')
    .setVersion('2.0.1')
    .addCookieAuth('access_token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // fs.writeFile('schema.json', JSON.stringify(document), (err) =>
  //   console.log(err),
  // );
  SwaggerModule.setup('docs', app, document);

  app.enableCors({
    origin: function (origin, callback) {
      if (origin !== undefined && origin.includes('ford-blog-client-v2')) {
        callback(null, true);
      } else {
        if (!origin || whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    },
    credentials: true,
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
    preflightContinue: false,
  });

  await app.listen(process.env.PORT || 8080);
}
bootstrap();
