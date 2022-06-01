import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as Mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Category } from '../../categories/entities/category.entity';
import { Type } from 'class-transformer';
import { User } from '../../users/entities/user.entity';
import { CommentDto } from '../dto/comment.dto';
import { urlRegex } from '../../shared/utils/regex.validation';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  _id: Mongoose.Types.ObjectId;

  @Prop({
    unique: true,
    required: true,
    type: String,
  })
  slug: string;

  @Prop({
    type: String,
    required: true,
  })
  title: string;

  @Prop({
    type: [
      {
        type: Mongoose.Types.ObjectId,
        ref: Category.name,
      },
    ],
    required: true,
  })
  @Type(() => Category)
  categories: [Category];

  @Prop({
    type: [
      {
        type: Mongoose.Types.ObjectId,
        ref: User.name,
      },
    ],
    default: [],
  })
  @Type(() => User)
  likers: [User];

  @Prop({ type: String, required: true })
  desc: string;

  @Prop({ type: String, required: true })
  sourceName: string;

  @Prop({
    type: String,
    match: [urlRegex, 'Please set a valid source url'],
    required: true,
  })
  sourceLink: string;

  @Prop({
    type: [
      {
        comment: {
          type: String,
        },
        createdAt: {
          type: Number,
        },
        updatedAt: {
          type: Number,
          required: false,
        },
        commenter: {
          type: Mongoose.Types.ObjectId,
          ref: User.name,
        },
      },
    ],
    default: [],
  })
  @Type(() => User)
  comments: [CommentDto];

  @Prop({
    type: String,
    match: [urlRegex, 'Please set a valid source url'],
  })
  picture: string;

  updatedAt: string;
  createdAt: string;
}

export const PostEntity = SchemaFactory.createForClass(Post)
  .set('timestamps', true)
  .set('versionKey', false);
