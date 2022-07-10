import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserEntity } from './entities/user.entity';
import { GoogleService } from '../cloud/google.service';
import { MailModule } from '../mail/mail.module';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [
    MailModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserEntity }]),
    forwardRef(() => PostsModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, GoogleService],
  exports: [UsersService],
})
export class UsersModule {}
