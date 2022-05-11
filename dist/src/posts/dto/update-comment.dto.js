"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCommentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const comment_dto_1 = require("./comment.dto");
class UpdateCommentDto extends (0, swagger_1.PickType)(comment_dto_1.CommentDto, [
    'comment',
    '_id',
]) {
}
exports.UpdateCommentDto = UpdateCommentDto;
//# sourceMappingURL=update-comment.dto.js.map