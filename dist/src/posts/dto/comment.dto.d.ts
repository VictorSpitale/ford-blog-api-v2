import * as Mongoose from 'mongoose';
import { CommenterDto } from '../../users/dto/commenter.dto';
export declare class CommentDto {
    readonly _id: Mongoose.Types.ObjectId;
    readonly commenter: CommenterDto;
    readonly comment: string;
    readonly createdAt: number;
    readonly updatedAt?: number;
}
