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
const update_post_dto_1 = require("./dto/update-post.dto");
const paginated_post_dto_1 = require("./dto/paginated-post.dto");
const HttpError_1 = require("../shared/error/HttpError");
const basic_post_dto_1 = require("./dto/basic-post.dto");
const create_comment_dto_1 = require("./dto/create-comment.dto");
const update_comment_dto_1 = require("./dto/update-comment.dto");
const delete_comment_dto_1 = require("./dto/delete-comment.dto");
let PostsController = class PostsController {
    constructor(postsService) {
        this.postsService = postsService;
    }
    create(createPostDto, file) {
        return this.postsService.create(createPostDto, file);
    }
    async getPosts(req, page) {
        return this.postsService.getPosts(req.user, page);
    }
    async getLastPosts(req) {
        return this.postsService.getLastPosts(req.user);
    }
    async getQueriedPosts(search) {
        return this.postsService.getQueriedPosts(search);
    }
    async getLikedPost(req, id) {
        return this.postsService.getLikedPosts(id, req.user);
    }
    async getPost(req, slug) {
        return this.postsService.getPost(slug, req.user);
    }
    async likePost(req, slug) {
        return this.postsService.likePost(slug, req.user);
    }
    async unlikePost(req, slug) {
        return this.postsService.unlikePost(slug, req.user);
    }
    async deletePost(req, slug) {
        return this.postsService.deletePost(slug, req.user);
    }
    async updatePost(req, updatePostDto, slug) {
        return this.postsService.updatePost(slug, updatePostDto, req.user);
    }
    async commentPost(req, comment, slug) {
        return this.postsService.commentPost(req.user, comment, slug);
    }
    async editPostComment(req, comment, slug) {
        return this.postsService.updatePostComment(req.user, slug, comment);
    }
    async deletePostComment(req, slug, commentDto) {
        return this.postsService.deletePostComment(req.user, slug, commentDto);
    }
    async patchLikePost(slug, req) {
        return this.postsService.getPostLikeStatus(slug, req.user);
    }
    async getCategorizedPosts(category) {
        return this.postsService.getCategorizedPosts(category);
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
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validations failed',
        type: HttpError_1.HttpValidationError,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized access',
        type: HttpError_1.HttpErrorDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'A post with this slug already exist',
        type: HttpError_1.HttpErrorDto,
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, roles_decorator_1.Role)(users_role_interface_1.IUserRole.POSTER),
    (0, swagger_1.ApiCookieAuth)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_post_dto_1.CreatePostDto, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all/paginated posts' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List all posts',
        type: paginated_post_dto_1.PaginatedPostDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Jwt failed',
        type: HttpError_1.HttpErrorDto,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        type: Number,
        description: 'Page to fetch, 3 items per page',
        required: false,
    }),
    (0, swagger_1.ApiCookieAuth)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
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
    (0, common_1.Get)('query'),
    (0, swagger_1.ApiOperation)({ summary: 'Query posts' }),
    (0, swagger_1.ApiQuery)({ name: 'search', type: String, example: 'puma' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List the 5 queried posts',
        type: [post_dto_1.PostDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Search query failed, search must be defined and more than 2 characters',
        type: HttpError_1.HttpErrorDto,
    }),
    (0, allow_any_decorator_1.AllowAny)(),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getQueriedPosts", null);
__decorate([
    (0, common_1.Get)('liked/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get posts liked by the user' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: String,
        description: 'User id',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Posts list',
        type: [basic_post_dto_1.BasicPostDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Jwt failed | Insufficient permissions',
        type: HttpError_1.HttpErrorDto,
    }),
    (0, swagger_1.ApiCookieAuth)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getLikedPost", null);
__decorate([
    (0, common_1.Get)(':slug'),
    (0, allow_any_decorator_1.AllowAny)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get post by slug' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The post got by its slug',
        type: post_dto_1.PostDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'The post doesnt exist',
        type: HttpError_1.HttpErrorDto,
    }),
    (0, swagger_1.ApiParam)({
        description: "Post's slug to query",
        name: 'slug',
        example: 'que-penser-de-la-ford-focus-st-line',
        required: true,
        type: String,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getPost", null);
__decorate([
    (0, common_1.Patch)('/like/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Like a post' }),
    (0, swagger_1.ApiParam)({
        name: 'slug',
        description: 'Post slug',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The post has been liked, return the number of likes',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Jwt failed',
        type: HttpError_1.HttpErrorDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'The post doesnt exist',
        type: HttpError_1.HttpErrorDto,
    }),
    (0, swagger_1.ApiCookieAuth)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "likePost", null);
__decorate([
    (0, common_1.Patch)('/unlike/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Unlike a post' }),
    (0, swagger_1.ApiParam)({
        name: 'slug',
        description: 'Post slug',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The post has been unliked, return the number of likes',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Jwt failed',
        type: HttpError_1.HttpErrorDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'The post doesnt exist',
        type: HttpError_1.HttpErrorDto,
    }),
    (0, swagger_1.ApiCookieAuth)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "unlikePost", null);
__decorate([
    (0, common_1.Delete)(':slug'),
    (0, roles_decorator_1.Role)(users_role_interface_1.IUserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a post' }),
    (0, swagger_1.ApiParam)({
        name: 'slug',
        description: 'Post slug',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The post has been deleted',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Jwt failed | Insufficient permissions',
        type: HttpError_1.HttpErrorDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'The post doesnt exist',
        type: HttpError_1.HttpErrorDto,
    }),
    (0, swagger_1.ApiCookieAuth)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "deletePost", null);
__decorate([
    (0, common_1.Patch)(':slug'),
    (0, roles_decorator_1.Role)(users_role_interface_1.IUserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update a post' }),
    (0, swagger_1.ApiParam)({
        type: String,
        name: 'slug',
        description: 'Post slug',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The post has been updated',
        type: post_dto_1.PostDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validations failed',
        type: HttpError_1.HttpValidationError,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized access',
        type: HttpError_1.HttpErrorDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'The post doesnt exist',
        type: HttpError_1.HttpErrorDto,
    }),
    (0, swagger_1.ApiCookieAuth)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_post_dto_1.UpdatePostDto, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "updatePost", null);
__decorate([
    (0, common_1.Post)('/comment/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Comment a post' }),
    (0, swagger_1.ApiParam)({
        type: String,
        name: 'slug',
        description: 'Post slug',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The post has been commented',
        type: post_dto_1.PostDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validations failed',
        type: HttpError_1.HttpValidationError,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized access',
        type: HttpError_1.HttpErrorDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'The post doesnt exist',
        type: HttpError_1.HttpErrorDto,
    }),
    (0, swagger_1.ApiCookieAuth)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_comment_dto_1.CreateCommentDto, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "commentPost", null);
__decorate([
    (0, common_1.Patch)('/comment/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a comment' }),
    (0, swagger_1.ApiParam)({
        type: String,
        name: 'slug',
        description: 'Post slug',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The updated post',
        type: post_dto_1.PostDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validations failed',
        type: HttpError_1.HttpValidationError,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized access',
        type: HttpError_1.HttpErrorDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'The post doesnt exist',
        type: HttpError_1.HttpErrorDto,
    }),
    (0, swagger_1.ApiCookieAuth)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_comment_dto_1.UpdateCommentDto, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "editPostComment", null);
__decorate([
    (0, common_1.Delete)('/comment/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a comment' }),
    (0, swagger_1.ApiParam)({
        type: String,
        name: 'slug',
        description: 'Post slug',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The updated post',
        type: post_dto_1.PostDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validations failed',
        type: HttpError_1.HttpValidationError,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized access',
        type: HttpError_1.HttpErrorDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'The post doesnt exist',
        type: HttpError_1.HttpErrorDto,
    }),
    (0, swagger_1.ApiCookieAuth)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('slug')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, delete_comment_dto_1.DeleteCommentDto]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "deletePostComment", null);
__decorate([
    (0, common_1.Get)('/isLiked/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Send the auth like status of a post' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The like status',
        type: Boolean,
    }),
    (0, swagger_1.ApiParam)({
        type: String,
        name: 'slug',
        description: 'Post slug',
    }),
    (0, swagger_1.ApiCookieAuth)(),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "patchLikePost", null);
__decorate([
    (0, common_1.Get)('/categorized/:category'),
    (0, swagger_1.ApiOperation)({ summary: 'Get posts related to a category' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The posts',
        type: [post_dto_1.PostDto],
    }),
    (0, swagger_1.ApiParam)({
        type: String,
        name: 'category',
        description: 'The category name',
        example: 'Sport',
    }),
    (0, allow_any_decorator_1.AllowAny)(),
    __param(0, (0, common_1.Param)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getCategorizedPosts", null);
PostsController = __decorate([
    (0, common_1.Controller)('posts'),
    (0, swagger_1.ApiTags)('Posts'),
    __metadata("design:paramtypes", [posts_service_1.PostsService])
], PostsController);
exports.PostsController = PostsController;
//# sourceMappingURL=posts.controller.js.map