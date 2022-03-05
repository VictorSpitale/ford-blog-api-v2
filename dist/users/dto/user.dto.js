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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDto = void 0;
const Mongoose = require("mongoose");
const create_user_dto_1 = require("./create-user.dto");
const class_validator_1 = require("class-validator");
const users_role_interface_1 = require("../entities/users.role.interface");
const swagger_1 = require("@nestjs/swagger");
class UserDto extends (0, swagger_1.PartialType)(create_user_dto_1.CreateUserDto) {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsMongoId)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: "User's id",
        example: '61f59acf09f089c9df951c37',
    }),
    __metadata("design:type", Mongoose.Types.ObjectId)
], UserDto.prototype, "_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(users_role_interface_1.IUserRole),
    (0, class_validator_1.IsIn)(Object.keys(users_role_interface_1.IUserRole)),
    (0, swagger_1.ApiProperty)({
        description: "User's role",
        default: users_role_interface_1.IUserRole.USER,
        enum: users_role_interface_1.IUserRole,
        type: users_role_interface_1.IUserRole,
        examples: [users_role_interface_1.IUserRole.USER, 'user'],
    }),
    __metadata("design:type", String)
], UserDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.Matches)('^\\$2[ayb]\\$.{56}$'),
    (0, swagger_1.ApiProperty)({
        description: "User's hashed password",
        type: String,
    }),
    __metadata("design:type", String)
], UserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: "User's created date",
        type: String,
        format: 'YYYY-mm-ddTHH:MM:ssZ',
    }),
    __metadata("design:type", String)
], UserDto.prototype, "createdAt", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: "User's last update date",
        type: String,
        format: 'YYYY-mm-ddTHH:MM:ssZ',
    }),
    __metadata("design:type", String)
], UserDto.prototype, "updatedAt", void 0);
exports.UserDto = UserDto;
//# sourceMappingURL=user.dto.js.map