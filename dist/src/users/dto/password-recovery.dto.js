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
exports.PasswordRecoveryDto = exports.PasswordPreRecoveryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const user_dto_1 = require("./user.dto");
const create_user_dto_1 = require("./create-user.dto");
class PasswordPreRecoveryDto extends (0, swagger_1.PickType)(user_dto_1.UserDto, ['email']) {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['fr', 'en']),
    (0, swagger_1.ApiProperty)({
        description: "User's locale",
        examples: ['fr', 'en'],
    }),
    __metadata("design:type", String)
], PasswordPreRecoveryDto.prototype, "locale", void 0);
exports.PasswordPreRecoveryDto = PasswordPreRecoveryDto;
class PasswordRecoveryDto extends (0, swagger_1.PickType)(create_user_dto_1.CreateUserDto, [
    'password',
]) {
}
exports.PasswordRecoveryDto = PasswordRecoveryDto;
//# sourceMappingURL=password-recovery.dto.js.map