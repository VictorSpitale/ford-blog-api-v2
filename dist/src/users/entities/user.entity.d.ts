import * as Mongoose from 'mongoose';
import { Document } from 'mongoose';
import { IUserRole } from './users.role.interface';
export declare type UserDocument = User & Document;
export declare class User {
    _id: Mongoose.Types.ObjectId;
    pseudo: string;
    email: string;
    password: string;
    role: IUserRole;
    picture: string;
    recoveryToken: string;
    updatedAt: string;
    createdAt: string;
    checkPassword: (plainPassword: string) => Promise<boolean>;
}
export declare const UserEntity: Mongoose.Schema<User, Mongoose.Model<User, any, any, any>, {}, {}, any>;
