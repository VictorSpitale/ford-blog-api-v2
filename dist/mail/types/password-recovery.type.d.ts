import { BasicEmailType } from './basic.type';
import { LocalesTypes } from '../../shared/types/locales.types';
export interface PasswordRecoveryInfos extends BasicEmailType {
    token: string;
    locale: LocalesTypes;
}
export interface PasswordRecoveryType extends PasswordRecoveryInfos {
    clientUrl: string;
}
