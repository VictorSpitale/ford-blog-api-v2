import { IUserRole } from '../../entities/users.role.interface';
import { UserDto } from '../../dto/user.dto';
import * as Mongoose from 'mongoose';
export declare const mockDate = "2016-05-18T16:00:00Z";
export declare const adminStub: () => UserDto;
export declare const UserStub: (role?: IUserRole, id?: Mongoose.Types.ObjectId) => UserDto;
export declare const UserStubWithoutPassword: () => UserDto;
export declare const UserStubWithoutPasswordAndDates: () => {
    _id: Mongoose.Types.ObjectId;
    pseudo: string;
    role: string;
    email: string;
};
