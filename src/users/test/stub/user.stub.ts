import { IUserRole } from '../../entities/users.role.interface';
import { UserDto } from '../../dto/user.dto';
import * as Mongoose from 'mongoose';

const mockObjectId = new Mongoose.Types.ObjectId();
const mockDate = '2016-05-18T16:00:00Z';

export const UserStub = (): UserDto => {
  return {
    _id: mockObjectId,
    pseudo: 'JohnDoe',
    role: IUserRole.USER,
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
