import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { CategoriesModule } from './categories/categories.module';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ApikeyMiddleware } from './auth/middleware/apikey.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      load: [config],
      isGlobal: true,
    }),
    DatabaseModule.forRoot(),
    AuthModule,
    UsersModule,
    PostsModule,
    CategoriesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useFactory: (ref) => new JwtAuthGuard(ref),
      inject: [Reflector],
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApikeyMiddleware).forRoutes('');
  }
}
