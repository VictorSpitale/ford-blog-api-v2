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
exports.CommentEntityDto = void 0;
const Mongoose = require("mongoose");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CommentEntityDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsMongoId)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: "Comment's id",
        example: '61f59acf09f089c9df951c37',
    }),
    __metadata("design:type", Mongoose.Types.ObjectId)
], CommentEntityDto.prototype, "_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsMongoId)(),
    (0, swagger_1.ApiProperty)({
        type: Mongoose.Types.ObjectId,
        description: "Commenter's object id",
    }),
    __metadata("design:type", Mongoose.Types.ObjectId)
], CommentEntityDto.prototype, "commenter", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Comment',
        example: 'What a beautiful car!',
    }),
    __metadata("design:type", String)
], CommentEntityDto.prototype, "comment", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: "Comment's created date (timestamp)",
        type: Number,
    }),
    __metadata("design:type", Number)
], CommentEntityDto.prototype, "createdAt", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: "Comment's last update date (timestamp)",
        type: Number,
        required: false,
    }),
    __metadata("design:type", Number)
], CommentEntityDto.prototype, "updatedAt", void 0);
exports.CommentEntityDto = CommentEntityDto;
//# sourceMappingURL=comment.entity.dto.js.map