import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { IUserRole } from './users.role.interface';
import * as Mongoose from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id: Mongoose.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    unique: true,
    minlength: 6,
    maxlength: 18,
  })
  pseudo: string;

  @Prop({
    type: String,
    unique: true,
    required: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({ type: String, required: true, minlength: 6 })
  password: string;

  @Prop({
    type: String,
    required: true,
    default: IUserRole.USER,
    enum: IUserRole,
  })
  role: IUserRole;

  updatedAt: string;
  createdAt: string;
}

export const UserEntity = SchemaFactory.createForClass(User).set(
  'timestamps',
  true,
);
UserEntity.pre<User>('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
