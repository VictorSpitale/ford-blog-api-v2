import { UserDto } from '../../dto/user.dto';
import * as Mongoose from 'mongoose';
export declare const UserStub: () => UserDto;
export declare const UserStubWithoutPassword: () => UserDto;
export declare const UserStubWithoutPasswordAndDates: () => {
    _id: Mongoose.Types.ObjectId;
    pseudo: string;
    role: string;
    email: string;
};
