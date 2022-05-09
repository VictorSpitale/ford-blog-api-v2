"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const user_dto_1 = require("./user.dto");
class LoginUserDto extends (0, swagger_1.PickType)(user_dto_1.UserDto, ['email', 'password']) {
}
exports.LoginUserDto = LoginUserDto;
//# sourceMappingURL=login-user.dto.js.map