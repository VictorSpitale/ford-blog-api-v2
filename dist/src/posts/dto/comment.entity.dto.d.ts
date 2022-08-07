import * as Mongoose from 'mongoose';
export declare class CommentEntityDto {
    readonly _id: Mongoose.Types.ObjectId;
    readonly commenter: Mongoose.Types.ObjectId;
    readonly comment: string;
    readonly createdAt: number;
    readonly updatedAt?: number;
}
