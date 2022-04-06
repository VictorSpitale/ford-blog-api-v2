import { IUserRole } from '../../entities/users.role.interface';
import { UserDto } from '../../dto/user.dto';
import * as Mongoose from 'mongoose';

const mockObjectId = new Mongoose.Types.ObjectId();
export const mockDate = '2016-05-18T16:00:00Z';
const authId = new Mongoose.Types.ObjectId();
export const adminStub = (): UserDto => {
  return {
    email: 'admin@doe.fr',
    _id: authId,
    password: 'password',
    pseudo: 'adminDoe',
    role: IUserRole.ADMIN,
    createdAt: mockDate,
    updatedAt: mockDate,
  };
};
export const UserStub = (role = IUserRole.USER, id = mockObjectId): UserDto => {
  return {
    _id: id,
    pseudo: 'JohnDoe',
    role,
    password: 'password',
    email: 'john@doe.fr',
    createdAt: mockDate,
    updatedAt: mockDate,
  };
};
export const UserStubWithoutPassword = (): UserDto => {
  return {
    _id: mockObjectId,
    pseudo: 'JohnDoe',
    role: IUserRole.USER,
    email: 'john@doe.fr',
    createdAt: mockDate,
    updatedAt: mockDate,
  };
};
export const UserStubWithoutPasswordAndDates = () => {
  return {
    _id: mockObjectId,
    pseudo: 'JohnDoe',
    role: IUserRole.USER.toString(),
    email: 'john@doe.fr',
  };
};
