import { PostDto } from '../../dto/post.dto';
export declare const PostStub: (slug?: string) => Omit<PostDto, 'authUserLiked'>;
