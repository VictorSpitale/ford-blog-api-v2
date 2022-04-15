"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_entity_1 = require("./entities/user.entity");
const mongoose_2 = require("mongoose");
const HttpError_1 = require("../shared/error/HttpError");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(createUserDto) {
        if (await this.getUserByEmail(createUserDto.email)) {
            throw new common_1.ConflictException(HttpError_1.HttpError.getHttpError(HttpError_1.HttpErrorCode.USER_ALREADY_EXIST));
        }
        if (await this.getUserByPseudo(createUserDto.pseudo)) {
            throw new common_1.ConflictException(HttpError_1.HttpError.getHttpError(HttpError_1.HttpErrorCode.USER_ALREADY_EXIST));
        }
        const createdUser = await this.userModel.create(createUserDto);
        return this.asDtoWithoutPassword(createdUser);
    }
    async getUsers() {
        const users = await this.find();
        return users.map((u) => this.asDtoWithoutPassword(u));
    }
    async getUserByEmail(email) {
        const user = await this.findOne({ email });
        return user ? this.asDtoWithoutPassword(user) : null;
    }
    async getUserById(id) {
        const user = await this.findOne({ _id: id });
        if (!user)
            throw new common_1.NotFoundException(HttpError_1.HttpError.getHttpError(HttpError_1.HttpErrorCode.USER_NOT_FOUND));
        return this.asDtoWithoutPassword(user);
    }
    async getUserByPseudo(pseudo) {
        const user = await this.findOne({ pseudo });
        return user ? this.asDtoWithoutPassword(user) : null;
    }
    update(id, updateUserDto) {
        return `This action updates a #${id} user`;
    }
    remove(id) {
        return `This action removes a #${id} user`;
    }
    async save(user) {
        await this.userModel.replaceOne({ _id: user._id }, user, { upsert: true });
    }
    async find(match = {}) {
        if (match._id) {
            if (!(0, mongoose_2.isValidObjectId)(match._id)) {
                throw new common_1.BadRequestException();
            }
            else {
                match._id = new mongoose_2.Types.ObjectId(match._id);
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
    async findOne(match) {
        const users = await this.find(match);
        if (users.length > 0) {
            return users[0];
        }
        else {
            return null;
        }
    }
    asDto(user) {
        return {
            _id: user._id,
            pseudo: user.pseudo,
            email: user.email,
            password: user.password,
            role: user.role,
            updatedAt: user.updatedAt,
            createdAt: user.createdAt,
        };
    }
    asDtoWithoutPassword(user) {
        return {
            _id: user._id,
            pseudo: user.pseudo,
            email: user.email,
            role: user.role,
            updatedAt: user.updatedAt,
            createdAt: user.createdAt,
        };
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_entity_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map