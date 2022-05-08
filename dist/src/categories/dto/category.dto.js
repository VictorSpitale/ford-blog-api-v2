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
exports.CategoryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_category_dto_1 = require("./create-category.dto");
const class_validator_1 = require("class-validator");
const Mongoose = require("mongoose");
class CategoryDto extends (0, swagger_1.PickType)(create_category_dto_1.CreateCategoryDto, ['name']) {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsMongoId)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: "Category's id",
        example: '61f59acf09f089c9df951c37',
    }),
    __metadata("design:type", Mongoose.Types.ObjectId)
], CategoryDto.prototype, "_id", void 0);
exports.CategoryDto = CategoryDto;
//# sourceMappingURL=category.dto.js.map