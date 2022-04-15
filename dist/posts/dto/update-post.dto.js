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
exports.UpdatePostDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const regex_validation_1 = require("../../shared/utils/regex.validation");
class UpdatePostDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Post's title",
        example: 'The new ford mustang',
        required: false,
        type: String,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePostDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Post's desc",
        example: 'It is the story about...',
        required: false,
        type: String,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePostDto.prototype, "desc", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Source's name",
        example: 'auto-moto',
        required: false,
        type: String,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdatePostDto.prototype, "sourceName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Source's link",
        example: 'https://auto-moto.fr',
        required: false,
        type: String,
        pattern: regex_validation_1.urlPattern,
    }),
    (0, class_validator_1.Matches)(regex_validation_1.urlPattern),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePostDto.prototype, "sourceLink", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Post's category ids",
        example: '[621bd3239a004010c4ba3b06e]',
        required: false,
        type: [String],
    }),
    (0, class_validator_1.IsMongoId)({ each: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdatePostDto.prototype, "categories", void 0);
exports.UpdatePostDto = UpdatePostDto;
//# sourceMappingURL=update-post.dto.js.map