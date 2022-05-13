import { CommentDto } from './comment.dto';
import * as Mongoose from 'mongoose';
declare const DeleteCommentDto_base: import("@nestjs/common").Type<Pick<CommentDto, "_id">>;
export declare class DeleteCommentDto extends DeleteCommentDto_base {
    readonly commenterId: Mongoose.Types.ObjectId;
}
export {};
