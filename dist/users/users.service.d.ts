import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';
import { MatchType } from '../shared/types/match.types';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(createUserDto: CreateUserDto): Promise<UserDto>;
    getUsers(): Promise<UserDto[]>;
    getUserByEmail(email: string): Promise<UserDto>;
    getUserById(id: string): Promise<UserDto>;
    private getUserByPseudo;
    update(id: number, updateUserDto: UpdateUserDto): string;
    remove(id: number): string;
    save(user: UserDto): Promise<void>;
    private find;
    findOne(match: MatchType): Promise<User | null>;
    asDto(user: User): UserDto;
    asDtoWithoutPassword(user: User): UserDto;
}
