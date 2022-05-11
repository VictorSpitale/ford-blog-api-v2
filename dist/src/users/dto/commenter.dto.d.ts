import * as Mongoose from 'mongoose';
export declare class CommenterDto {
    readonly _id: Mongoose.Types.ObjectId;
    readonly pseudo: string;
    readonly picture?: string;
}
