import * as Mongoose from 'mongoose';
import { CategoryDto } from '../../dto/category.dto';

const mockObjectId = new Mongoose.Types.ObjectId();

export const CategoryStub = (): CategoryDto => {
  return {
    _id: mockObjectId,
    name: 'sport',
  };
};
