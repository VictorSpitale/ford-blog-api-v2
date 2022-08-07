import * as Mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';
import { CommentEntityDto } from '../dto/comment.entity.dto';
export declare type PostDocument = Post & Document;
export declare class Post {
    _id: Mongoose.Types.ObjectId;
    slug: string;
    title: string;
    categories: [Category];
    likers: [User];
    desc: string;
    sourceName: string;
    sourceLink: string;
    comments: [CommentEntityDto];
    picture: string;
    updatedAt: string;
    createdAt: string;
}
export declare const PostEntity: Mongoose.Schema<Post, Mongoose.Model<Post, any, any, any, any>, {}, {}, {}, {}, "type", Post>;
