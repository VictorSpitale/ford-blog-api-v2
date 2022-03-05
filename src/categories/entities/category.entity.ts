import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as Mongoose from 'mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: false })
export class Category {
  _id: Mongoose.Types.ObjectId;

  @Prop({
    unique: true,
    required: true,
    type: String,
  })
  name: string;
}

export const CategoryEntity = SchemaFactory.createForClass(Category).set(
  'versionKey',
  false,
);
