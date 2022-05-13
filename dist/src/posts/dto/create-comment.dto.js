"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCommentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const comment_dto_1 = require("./comment.dto");
class CreateCommentDto extends (0, swagger_1.PickType)(comment_dto_1.CommentDto, ['comment']) {
}
exports.CreateCommentDto = CreateCommentDto;
//# sourceMappingURL=create-comment.dto.js.map