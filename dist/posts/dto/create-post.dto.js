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
exports.CreatePostDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const regex_validation_1 = require("../../shared/utils/regex.validation");
class CreatePostDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Post's title",
        example: 'The new ford mustang',
        required: true,
        type: String,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePostDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Post's slug",
        example: 'the-new-ford-mustang',
        required: true,
        type: String,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePostDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Post's desc",
        example: 'It is the story about...',
        required: true,
        type: String,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePostDto.prototype, "desc", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Source's name",
        example: 'auto-moto',
        required: true,
        type: String,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePostDto.prototype, "sourceName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Source's link",
        example: 'https://auto-moto.fr',
        required: true,
        type: String,
        pattern: regex_validation_1.urlPattern,
    }),
    (0, class_validator_1.Matches)(regex_validation_1.urlPattern),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePostDto.prototype, "sourceLink", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Post's category ids",
        example: '[621bd3239a004010c4ba3b06e]',
        required: true,
        type: [String],
    }),
    (0, class_validator_1.IsMongoId)({ each: true }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], CreatePostDto.prototype, "categories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'File to upload, converted to picture url',
        example: 'https://storage.googleapis.com/name',
        type: String,
        pattern: regex_validation_1.urlPattern,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(regex_validation_1.urlPattern),
    __metadata("design:type", String)
], CreatePostDto.prototype, "picture", void 0);
exports.CreatePostDto = CreatePostDto;
//# sourceMappingURL=create-post.dto.js.map