/// <reference types="multer" />
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';
import { MatchType } from '../shared/types/match.types';
import { GoogleService } from '../cloud/google.service';
import { MailService } from '../mail/mail.service';
import { LocalesTypes } from '../shared/types/locales.types';
import { PasswordRecoveryDto } from './dto/password-recovery.dto';
import { PostsService } from '../posts/posts.service';
export declare class UsersService {
    private userModel;
    private readonly googleService;
    private readonly mailService;
    private readonly postsService;
    constructor(userModel: Model<UserDocument>, googleService: GoogleService, mailService: MailService, postsService: PostsService);
    create(createUserDto: CreateUserDto): Promise<UserDto>;
    getUsers(): Promise<UserDto[]>;
    getUserByEmail(email: string): Promise<UserDto>;
    getUserById(id: string): Promise<UserDto>;
    private getUserByPseudo;
    update(id: string, updateUserDto: UpdateUserDto, user: User): Promise<UserDto>;
    uploadProfilePicture(id: string, file: Express.Multer.File, user: User): Promise<{
        picture: string;
    }>;
    removeProfilePicture(id: string, user: User): Promise<void>;
    isSelfOrAdmin(id: string, user: User): void;
    deleteUser(id: string, authUser: User): Promise<void>;
    sendPasswordRecovery(email: string, locale: LocalesTypes): Promise<void>;
    recoverPassword(token: string, body: PasswordRecoveryDto): Promise<void>;
    save(user: UserDto): Promise<void>;
    private find;
    findOne(match: MatchType): Promise<User | null>;
    asDto(user: User): UserDto;
    asDtoWithoutPassword(user: User): UserDto;
}
