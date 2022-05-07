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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const user_dto_1 = require("./dto/user.dto");
const swagger_1 = require("@nestjs/swagger");
const allow_any_decorator_1 = require("../auth/decorators/allow-any.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const users_role_interface_1 = require("./entities/users.role.interface");
const platform_express_1 = require("@nestjs/platform-express");
const password_recovery_dto_1 = require("./dto/password-recovery.dto");
const HttpError_1 = require("../shared/error/HttpError");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    create(createUserDto) {
        return this.usersService.create(createUserDto);
    }
    async getUsers() {
        return this.usersService.getUsers();
    }
    async getUserById(id) {
        return this.usersService.getUserById(id);
    }
    async updateUser(id, updateUserDto, req) {
        return this.usersService.update(id, updateUserDto, req.user);
    }
    async uploadProfilePicture(file, req, id) {
        return this.usersService.uploadProfilePicture(id, file, req.user);
    }
    async removeProfilePicture(req, id) {
        return this.usersService.removeProfilePicture(id, req.user);
    }
    async deleteUser(req, id) {
        return this.usersService.deleteUser(id, req.user);
    }
    async sendPasswordRecovery(body) {
        return this.usersService.sendPasswordRecovery(body.email, body.locale);
    }
    async recoverPassword(body, token) {
        return this.usersService.recoverPassword(token, body);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, allow_any_decorator_1.AllowAny)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a user' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The user has been created',
        type: user_dto_1.UserDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validations failed',
        type: HttpError_1.HttpValidationError,
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'The user already exist',
        type: HttpError_1.HttpErrorDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List all users', type: [user_dto_1.UserDto] }),
    (0, roles_decorator_1.Role)(users_role_interface_1.IUserRole.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user by id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User founded', type: user_dto_1.UserDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Id is not a valid id' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, roles_decorator_1.Role)(users_role_interface_1.IUserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Patch)('/upload/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "uploadProfilePicture", null);
__decorate([
    (0, common_1.Delete)('/upload/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "removeProfilePicture", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Post)('password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, allow_any_decorator_1.AllowAny)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [password_recovery_dto_1.PasswordPreRecoveryDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "sendPasswordRecovery", null);
__decorate([
    (0, common_1.Post)('/password/:token'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, allow_any_decorator_1.AllowAny)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [password_recovery_dto_1.PasswordRecoveryDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "recoverPassword", null);
UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, swagger_1.ApiTags)('Users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map