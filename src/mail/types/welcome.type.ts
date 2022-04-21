import { BasicEmailType } from './basic.type';

export type WelcomeEmailInfos = BasicEmailType;

export interface WelcomeEmailType extends WelcomeEmailInfos {
  clientUrl: string;
}
