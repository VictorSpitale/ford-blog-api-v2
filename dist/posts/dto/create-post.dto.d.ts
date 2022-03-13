import * as Mongoose from 'mongoose';
export declare class CreatePostDto {
    readonly title: string;
    readonly slug: string;
    readonly desc: string;
    readonly sourceName: string;
    readonly sourceLink: string;
    readonly categories: Mongoose.Types.ObjectId[];
    readonly file?: any;
}
