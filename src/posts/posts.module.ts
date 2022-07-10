import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostEntity } from './entities/post.entity';
import { GoogleService } from '../cloud/google.service';
import { UsersModule } from '../users/users.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => CategoriesModule),
    MongooseModule.forFeature([{ name: Post.name, schema: PostEntity }]),
  ],
  controllers: [PostsController],
  providers: [PostsService, GoogleService],
  exports: [PostsService],
})
export class PostsModule {}
