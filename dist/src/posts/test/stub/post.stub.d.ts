import { PostDto } from '../../dto/post.dto';
import * as Mongoose from 'mongoose';
import { CreatePostDto } from '../../dto/create-post.dto';
import { CommentDto } from '../../dto/comment.dto';
export declare const commentMockedId: Mongoose.Types.ObjectId;
export declare const PostStub: (slug?: string) => Omit<PostDto, 'authUserLiked'>;
export declare const CreatePostStub: (slug?: string) => CreatePostDto;
export declare const mockedComment: () => CommentDto;
