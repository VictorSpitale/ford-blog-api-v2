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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const category_entity_1 = require("./entities/category.entity");
const mongoose_2 = require("mongoose");
const HttpError_1 = require("../shared/error/HttpError");
const posts_service_1 = require("../posts/posts.service");
let CategoriesService = class CategoriesService {
    constructor(categoryModel, postsService) {
        this.categoryModel = categoryModel;
        this.postsService = postsService;
    }
    async create(createCategoryDto) {
        if (await this.getCategoryByName(createCategoryDto.name)) {
            throw new common_1.ConflictException(HttpError_1.HttpError.getHttpError(HttpError_1.HttpErrorCode.DUPLICATE_CATEGORY));
        }
        const createdCategory = await this.categoryModel.create(createCategoryDto);
        return this.asDto(createdCategory);
    }
    async getCategoryByName(name) {
        const category = await this.findOne({ name });
        return category ? this.asDto(category) : null;
    }
    async getCategories() {
        const categories = await this.find();
        return categories.map((cat) => this.asDto(cat));
    }
    async getCategoryById(id) {
        const category = await this.findOne({ _id: id });
        if (!category)
            throw new common_1.NotFoundException(HttpError_1.HttpError.getHttpError(HttpError_1.HttpErrorCode.CATEGORY_NOT_FOUND));
        return this.asDto(category);
    }
    async deleteCategory(id, authUser) {
        const category = await this.getCategoryById(id);
        const posts = await this.postsService.getCategorizedPosts(category.name);
        for (const post of posts) {
            const categories = post.categories
                .filter((cat) => cat._id.toString() !== id)
                .map((cat) => cat._id);
            await this.postsService.updatePost(post.slug, {
                categories,
            }, authUser);
        }
        await this.categoryModel.findOneAndDelete({ _id: id });
    }
    async find(match = {}) {
        if (match._id) {
            if (!(0, mongoose_2.isValidObjectId)(match._id)) {
                throw new common_1.BadRequestException(HttpError_1.HttpError.getHttpError(HttpError_1.HttpErrorCode.INVALID_ID));
            }
            else {
                match._id = new mongoose_2.Types.ObjectId(match._id);
            }
        }
        return this.categoryModel.find(match, {
            _id: 1,
            name: 1,
        });
    }
    async findOne(match) {
        const category = await this.find(match);
        if (category.length > 0) {
            return category[0];
        }
        else {
            return null;
        }
    }
    asDto(category) {
        return {
            _id: category._id,
            name: category.name,
        };
    }
};
CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(category_entity_1.Category.name)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => posts_service_1.PostsService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        posts_service_1.PostsService])
], CategoriesService);
exports.CategoriesService = CategoriesService;
//# sourceMappingURL=categories.service.js.map