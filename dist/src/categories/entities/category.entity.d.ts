import * as Mongoose from 'mongoose';
import { Document } from 'mongoose';
export declare type CategoryDocument = Category & Document;
export declare class Category {
    _id: Mongoose.Types.ObjectId;
    name: string;
}
export declare const CategoryEntity: Mongoose.Schema<Category, Mongoose.Model<Category, any, any, any, any>, {}, {}, {}, {}, "type", Category>;
