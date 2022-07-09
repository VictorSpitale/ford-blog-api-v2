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
exports.CategoriesController = void 0;
const common_1 = require("@nestjs/common");
const categories_service_1 = require("./categories.service");
const swagger_1 = require("@nestjs/swagger");
const category_dto_1 = require("./dto/category.dto");
const create_category_dto_1 = require("./dto/create-category.dto");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const users_role_interface_1 = require("../users/entities/users.role.interface");
const allow_any_decorator_1 = require("../auth/decorators/allow-any.decorator");
const HttpError_1 = require("../shared/error/HttpError");
let CategoriesController = class CategoriesController {
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
    }
    async create(createCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }
    async getCategories() {
        return this.categoriesService.getCategories();
    }
    async getCategoryById(id) {
        return this.categoriesService.getCategoryById(id);
    }
    async deleteCategory(id, req) {
        return this.categoriesService.deleteCategory(id, req.user);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a category' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The category has been created',
        type: category_dto_1.CategoryDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validations failed',
        type: HttpError_1.HttpValidationError,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Jwt failed | Insufficient permissions',
        type: HttpError_1.HttpErrorDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'The category already exist',
        type: HttpError_1.HttpErrorDto,
    }),
    (0, roles_decorator_1.Role)(users_role_interface_1.IUserRole.ADMIN),
    (0, swagger_1.ApiCookieAuth)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all categories' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List all categories',
        type: [category_dto_1.CategoryDto],
    }),
    (0, allow_any_decorator_1.AllowAny)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get category by id' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Category found',
        type: category_dto_1.CategoryDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Id is not a valid id',
        type: HttpError_1.HttpErrorDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Category not found',
        type: HttpError_1.HttpErrorDto,
    }),
    (0, allow_any_decorator_1.AllowAny)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "getCategoryById", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Role)(users_role_interface_1.IUserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a category' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Category slug',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The category has been deleted',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Jwt failed | Insufficient permissions',
        type: HttpError_1.HttpErrorDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'The category doesnt exist',
        type: HttpError_1.HttpErrorDto,
    }),
    (0, swagger_1.ApiCookieAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "deleteCategory", null);
CategoriesController = __decorate([
    (0, common_1.Controller)('categories'),
    (0, swagger_1.ApiTags)('Categories'),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService])
], CategoriesController);
exports.CategoriesController = CategoriesController;
//# sourceMappingURL=categories.controller.js.map