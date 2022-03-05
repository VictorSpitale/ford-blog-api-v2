import { IUserRole } from '../../users/entities/users.role.interface';
import { SetMetadata } from '@nestjs/common';

export const ROLE_KEY = 'role';
export const Role = (role: IUserRole) => SetMetadata(ROLE_KEY, role);
