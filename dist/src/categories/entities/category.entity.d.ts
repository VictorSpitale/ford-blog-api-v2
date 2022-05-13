import * as Mongoose from 'mongoose';
import { Document } from 'mongoose';
export declare type CategoryDocument = Category & Document;
export declare class Category {
    _id: Mongoose.Types.ObjectId;
    name: string;
}
export declare const CategoryEntity: Mongoose.Schema<Mongoose.Document<Category, any, any>, Mongoose.Model<Mongoose.Document<Category, any, any>, any, any, any>, any, any>;
