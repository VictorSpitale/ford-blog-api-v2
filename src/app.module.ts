import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { CategoriesModule } from './categories/categories.module';

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
})
export class AppModule {}
