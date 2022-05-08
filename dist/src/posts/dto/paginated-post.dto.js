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
exports.PaginatedPostDto = void 0;
const post_dto_1 = require("./post.dto");
const swagger_1 = require("@nestjs/swagger");
class PaginatedPostDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        required: true,
        type: Boolean,
        description: 'Has more posts',
        example: true,
    }),
    __metadata("design:type", Boolean)
], PaginatedPostDto.prototype, "hasMore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: true,
        type: [post_dto_1.PostDto],
        description: 'Posts',
    }),
    __metadata("design:type", Array)
], PaginatedPostDto.prototype, "posts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: true,
        type: Number,
        description: 'Page number',
        example: 1,
    }),
    __metadata("design:type", Number)
], PaginatedPostDto.prototype, "page", void 0);
exports.PaginatedPostDto = PaginatedPostDto;
//# sourceMappingURL=paginated-post.dto.js.map