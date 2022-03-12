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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsController = void 0;
const common_1 = require("@nestjs/common");
const posts_service_1 = require("./posts.service");
const swagger_1 = require("@nestjs/swagger");
const post_dto_1 = require("./dto/post.dto");
const create_post_dto_1 = require("./dto/create-post.dto");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const users_role_interface_1 = require("../users/entities/users.role.interface");
const allow_any_decorator_1 = require("../auth/decorators/allow-any.decorator");
const platform_express_1 = require("@nestjs/platform-express");
let PostsController = class PostsController {
    constructor(postsService) {
        this.postsService = postsService;
    }
    create(createPostDto, file) {
        return this.postsService.create(createPostDto, file);
    }
    async getPosts(req) {
        return this.postsService.getPosts(req.user);
    }
    async getLastPosts(req) {
        return this.postsService.getLastPosts(req.user);
    }
    async getPost(req, slug) {
        return this.postsService.getPost(slug, req.user);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a post' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The post has been created',
        type: post_dto_1.PostDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validations failed' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden ressource' }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'The post with this slug already exist',
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, roles_decorator_1.Role)(users_role_interface_1.IUserRole.POSTER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_post_dto_1.CreatePostDto, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all posts' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List all posts', type: [post_dto_1.PostDto] }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getPosts", null);
__decorate([
    (0, common_1.Get)('last'),
    (0, swagger_1.ApiOperation)({ summary: 'Get 6 last posts' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List the 6 last posts',
        type: [post_dto_1.PostDto],
    }),
    (0, allow_any_decorator_1.AllowAny)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getLastPosts", null);
__decorate([
    (0, common_1.Get)(':slug'),
    (0, allow_any_decorator_1.AllowAny)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getPost", null);
PostsController = __decorate([
    (0, common_1.Controller)('posts'),
    (0, swagger_1.ApiTags)('Posts'),
    __metadata("design:paramtypes", [posts_service_1.PostsService])
], PostsController);
exports.PostsController = PostsController;
//# sourceMappingURL=posts.controller.js.map