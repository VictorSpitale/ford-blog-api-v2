import { UserDto } from './user.dto';
declare const LoginUserDto_base: import("@nestjs/common").Type<Pick<UserDto, "email" | "password">>;
export declare class LoginUserDto extends LoginUserDto_base {
}
export {};
