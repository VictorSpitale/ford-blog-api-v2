"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCategoryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const category_dto_1 = require("./category.dto");
class UpdateCategoryDto extends (0, swagger_1.PickType)(category_dto_1.CategoryDto, ['name']) {
}
exports.UpdateCategoryDto = UpdateCategoryDto;
//# sourceMappingURL=update-category.dto.js.map