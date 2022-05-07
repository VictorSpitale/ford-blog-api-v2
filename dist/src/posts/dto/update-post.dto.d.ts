import * as Mongoose from 'mongoose';
export declare class UpdatePostDto {
    readonly title?: string;
    readonly desc?: string;
    readonly sourceName?: string;
    readonly sourceLink?: string;
    readonly categories?: Mongoose.Types.ObjectId[];
}
