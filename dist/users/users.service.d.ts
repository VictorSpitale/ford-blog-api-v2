/// <reference types="multer" />
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';
import { MatchType } from '../shared/types/match.types';
import { GoogleService } from '../cloud/google.service';
export declare class UsersService {
    private userModel;
    private readonly googleService;
    constructor(userModel: Model<UserDocument>, googleService: GoogleService);
    create(createUserDto: CreateUserDto): Promise<UserDto>;
    getUsers(): Promise<UserDto[]>;
    getUserByEmail(email: string): Promise<UserDto>;
    getUserById(id: string): Promise<UserDto>;
    private getUserByPseudo;
    update(id: string, updateUserDto: UpdateUserDto, user: User): Promise<UserDto>;
    uploadProfilePicture(id: string, file: Express.Multer.File, user: User): Promise<{
        picture: string;
    }>;
    private isSelfOrAdmin;
    remove(id: number): string;
    save(user: UserDto): Promise<void>;
    private find;
    findOne(match: MatchType): Promise<User | null>;
    asDto(user: User): UserDto;
    asDtoWithoutPassword(user: User): UserDto;
}
