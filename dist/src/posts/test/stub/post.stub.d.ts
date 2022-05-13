import { PostDto } from '../../dto/post.dto';
import { CreatePostDto } from '../../dto/create-post.dto';
export declare const PostStub: (slug?: string) => Omit<PostDto, 'authUserLiked'>;
export declare const CreatePostStub: (slug?: string) => CreatePostDto;
