"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const user_dto_1 = require("./user.dto");
class BasicUserDto extends (0, swagger_1.PickType)(user_dto_1.UserDto, [
    '_id',
    'pseudo',
    'picture',
]) {
}
exports.BasicUserDto = BasicUserDto;
//# sourceMappingURL=basic-user.dto.js.map