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
exports.PostDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_post_dto_1 = require("./create-post.dto");
const class_validator_1 = require("class-validator");
const Mongoose = require("mongoose");
const comment_dto_1 = require("./comment.dto");
const category_dto_1 = require("../../categories/dto/category.dto");
class PostDto extends (0, swagger_1.OmitType)(create_post_dto_1.CreatePostDto, ['categories']) {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsMongoId)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: "Post's id",
        example: '61f59acf09f089c9df951c37',
    }),
    __metadata("design:type", Mongoose.Types.ObjectId)
], PostDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Post's category ids",
        example: `[{
            "_id": "621bd3239a004010c4ba3b06",
            "name": "sport"
        }]`,
        required: true,
        type: [category_dto_1.CategoryDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], PostDto.prototype, "categories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of likes',
        example: '12',
        type: Number,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PostDto.prototype, "likes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Auth user like status',
        example: true,
        type: Boolean,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PostDto.prototype, "authUserLiked", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, swagger_1.ApiProperty)({
        description: "Post's comments",
        example: `[{
            "_id": "621bd3239a004010c4ba3b06",
            "commenter": {
              pseudo: 'John',
              picture: 'url_to_picture'
             },
            "comment": "my comment",
            "createdAt": "date",
            "updatedAt": "date"
        }]`,
        type: [comment_dto_1.CommentDto],
    }),
    __metadata("design:type", Array)
], PostDto.prototype, "comments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Picture url',
        example: 'url to picture',
        type: String,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PostDto.prototype, "picture", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: "Post's created date",
        type: String,
        format: 'YYYY-mm-ddTHH:MM:ssZ',
    }),
    __metadata("design:type", String)
], PostDto.prototype, "createdAt", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: "Post's last update date",
        type: String,
        format: 'YYYY-mm-ddTHH:MM:ssZ',
    }),
    __metadata("design:type", String)
], PostDto.prototype, "updatedAt", void 0);
exports.PostDto = PostDto;
//# sourceMappingURL=post.dto.js.map