import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as Mongoose from 'mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { IUserRole } from './users.role.interface';
import { urlRegex } from '../../shared/utils/regex.validation';

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
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
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

  @Prop({
    type: String,
    required: false,
    match: [urlRegex, 'Please set a valid source url'],
  })
  picture: string;

  updatedAt: string;
  createdAt: string;

  checkPassword: (plainPassword: string) => Promise<boolean>;
}

export const UserEntity = SchemaFactory.createForClass(User)
  .set('timestamps', true)
  .set('versionKey', false);

UserEntity.pre<User>('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//@TODO: Résoudre les pbs avec ts
UserEntity.pre('findOneAndUpdate', async function () {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (this._update.password) {
    const salt = await bcrypt.genSalt();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._update.password = await bcrypt.hash(this._update.password, salt);
  }
});

UserEntity.methods.checkPassword = async function (
  plainPassword: string,
): Promise<boolean> {
  const user = <UserDocument>this;
  return await bcrypt.compare(plainPassword, user.password);
};
