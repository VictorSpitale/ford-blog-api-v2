import { LocalesTypes } from '../../shared/types/locales.types';
import { UserDto } from './user.dto';
import { CreateUserDto } from './create-user.dto';
declare const PasswordPreRecoveryDto_base: import("@nestjs/common").Type<Pick<UserDto, "email">>;
export declare class PasswordPreRecoveryDto extends PasswordPreRecoveryDto_base {
    readonly locale: LocalesTypes;
}
declare const PasswordRecoveryDto_base: import("@nestjs/common").Type<Pick<CreateUserDto, "password">>;
export declare class PasswordRecoveryDto extends PasswordRecoveryDto_base {
}
export {};
