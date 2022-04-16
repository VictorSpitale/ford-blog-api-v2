import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<UserDto>;
    getUsers(): Promise<UserDto[]>;
    getUserById(id: string): Promise<UserDto>;
    updateUser(id: string, updateUserDto: UpdateUserDto, req: any): Promise<UserDto>;
    remove(id: string): string;
}
