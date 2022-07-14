import * as Mongoose from 'mongoose';
import { CategoryDto } from '../../dto/category.dto';

export const CategoryStub = (name = 'sport'): CategoryDto => {
  const mockObjectId = new Mongoose.Types.ObjectId();
  return {
    _id: mockObjectId,
    name,
  };
};
