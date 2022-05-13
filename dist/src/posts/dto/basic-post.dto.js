"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicPostDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const post_dto_1 = require("./post.dto");
class BasicPostDto extends (0, swagger_1.PickType)(post_dto_1.PostDto, [
    'picture',
    'slug',
    'title',
    'desc',
]) {
}
exports.BasicPostDto = BasicPostDto;
//# sourceMappingURL=basic-post.dto.js.map