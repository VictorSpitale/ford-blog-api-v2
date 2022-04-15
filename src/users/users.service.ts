import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { isValidObjectId, Model, Types } from 'mongoose';
import { UserDto } from './dto/user.dto';
import { MatchType } from '../shared/types/match.types';
import { HttpError, HttpErrorCode } from '../shared/error/HttpError';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    if (await this.getUserByEmail(createUserDto.email)) {
      throw new ConflictException(
        HttpError.getHttpError(HttpErrorCode.USER_ALREADY_EXIST),
      );
    }
    if (await this.getUserByPseudo(createUserDto.pseudo)) {
      throw new ConflictException(
        HttpError.getHttpError(HttpErrorCode.USER_ALREADY_EXIST),
      );
    }
    const createdUser = await this.userModel.create(createUserDto);
    return this.asDtoWithoutPassword(createdUser);
  }

  async getUsers(): Promise<UserDto[]> {
    const users = await this.find();
    return users.map((u) => this.asDtoWithoutPassword(u));
  }

  async getUserByEmail(email: string): Promise<UserDto> {
    const user = await this.findOne({ email });
    return user ? this.asDtoWithoutPassword(user) : null;
  }

  async getUserById(id: string): Promise<UserDto> {
    const user = await this.findOne({ _id: id });
    if (!user)
      throw new NotFoundException(
        HttpError.getHttpError(HttpErrorCode.USER_NOT_FOUND),
      );
    return this.asDtoWithoutPassword(user);
  }

  private async getUserByPseudo(pseudo: string): Promise<UserDto> {
    const user = await this.findOne({ pseudo });
    return user ? this.asDtoWithoutPassword(user) : null;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async save(user: UserDto) {
    await this.userModel.replaceOne({ _id: user._id }, user, { upsert: true });
  }

  private async find(match: MatchType = {}) {
    if (match._id) {
      if (!isValidObjectId(match._id)) {
        throw new BadRequestException();
      } else {
        match._id = new Types.ObjectId(match._id as string);
      }
    }
    return this.userModel.find(match, {
      _id: 1,
      password: 1,
      pseudo: 1,
      email: 1,
      role: 1,
      createdAt: 1,
      updatedAt: 1,
    });
  }

  async findOne(match: MatchType): Promise<User | null> {
    const users = await this.find(match);
    if (users.length > 0) {
      return users[0];
    } else {
      return null;
    }
  }

  asDto(user: User): UserDto {
    return {
      _id: user._id,
      pseudo: user.pseudo,
      email: user.email,
      password: user.password,
      role: user.role,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
    } as UserDto;
  }
  asDtoWithoutPassword(user: User): UserDto {
    return {
      _id: user._id,
      pseudo: user.pseudo,
      email: user.email,
      role: user.role,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
    } as UserDto;
  }
}
