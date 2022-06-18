import { PostDto } from './post.dto';
declare const BasicPostDto_base: import("@nestjs/common").Type<Pick<PostDto, "title" | "picture" | "desc" | "slug">>;
export declare class BasicPostDto extends BasicPostDto_base {
}
export {};
