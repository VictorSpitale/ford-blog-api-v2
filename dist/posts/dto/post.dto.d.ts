import { CreatePostDto } from './create-post.dto';
import * as Mongoose from 'mongoose';
import { CommentDto } from './comment.dto';
import { CategoryDto } from '../../categories/dto/category.dto';
declare const PostDto_base: import("@nestjs/common").Type<Omit<CreatePostDto, "categories">>;
export declare class PostDto extends PostDto_base {
    readonly _id: Mongoose.Types.ObjectId;
    readonly categories: CategoryDto[];
    readonly likes: number;
    readonly authUserLiked: boolean;
    readonly comments: CommentDto[];
    readonly picture: string;
    readonly createdAt: string;
    readonly updatedAt: string;
}
export {};
