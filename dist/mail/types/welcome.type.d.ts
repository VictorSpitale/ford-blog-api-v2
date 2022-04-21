import { BasicEmailType } from './basic.type';
export declare type WelcomeEmailInfos = BasicEmailType;
export interface WelcomeEmailType extends WelcomeEmailInfos {
    clientUrl: string;
}
