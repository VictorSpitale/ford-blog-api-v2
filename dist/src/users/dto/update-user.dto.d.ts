import { IUserRole } from '../entities/users.role.interface';
export declare class UpdateUserDto {
    readonly pseudo?: string;
    readonly password?: string;
    readonly currentPassword?: string;
    readonly role?: IUserRole;
}
