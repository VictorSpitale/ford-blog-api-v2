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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const post_entity_1 = require("./entities/post.entity");
const Mongoose = require("mongoose");
const mongoose_2 = require("mongoose");
const google_service_1 = require("../cloud/google.service");
const upload_types_1 = require("../shared/types/upload.types");
const post_types_1 = require("../shared/types/post.types");
const HttpError_1 = require("../shared/error/HttpError");
const users_service_1 = require("../users/users.service");
const categories_service_1 = require("../categories/categories.service");
const _ = require("lodash");
let PostsService = class PostsService {
    constructor(postModel, googleService, usersService, categoriesService) {
        this.postModel = postModel;
        this.googleService = googleService;
        this.usersService = usersService;
        this.categoriesService = categoriesService;
    }
    async create(createPostDto, file) {
        if (await this.checkIfPostIsDuplicatedBySlug(createPostDto.slug)) {
            throw new common_1.ConflictException(HttpError_1.HttpError.getHttpError(HttpError_1.HttpErrorCode.DUPLICATE_SLUG));
        }
        let data = Object.assign({}, createPostDto);
        if (file) {
            const picturePath = await this.googleService.uploadFile(file, createPostDto.slug, upload_types_1.UploadTypes.POST);
            data = Object.assign(Object.assign({}, data), { picture: picturePath });
        }
        const createdPost = await this.postModel.create(data);
        await createdPost.populate('categories');
        return this.asDto(createdPost, null);
    }
    async likePost(slug, user) {
        return this.updateLikeStatus(slug, user, post_types_1.LikeOperation.LIKE);
    }
    async unlikePost(slug, user) {
        return this.updateLikeStatus(slug, user, post_types_1.LikeOperation.UNLIKE);
    }
    async updateLikeStatus(slug, user, operation) {
        if (!(await this.postModel.findOne({ slug }))) {
            throw new common_1.NotFoundException(HttpError_1.HttpError.getHttpError(HttpError_1.HttpErrorCode.POST_NOT_FOUND));
        }
        const updated = await this.postModel
            .findOneAndUpdate({ slug }, { [operation]: { likers: user._id } }, { new: true })
            .populate('likers');
        return this.asDto(updated, user).likes;
    }
    async deletePost(slug, user) {
        await this.getPost(slug, user);
        await this.postModel.findOneAndDelete({ slug });
        await this.googleService.deleteFile(slug, upload_types_1.UploadTypes.POST);
    }
    async updatePost(slug, updatePostDto, user) {
        await this.getPost(slug, user);
        const updated = await this.postModel
            .findOneAndUpdate({ slug }, Object.assign({}, updatePostDto), { new: true })
            .populate('categories likers')
            .populate('comments.commenter', ['pseudo', 'picture']);
        return this.asDto(updated, user);
    }
    async getPosts(user, page) {
        let posts;
        let hasMore = false;
        if (!page)
            posts = await this.find({});
        else {
            if (page <= 0)
                page = 1;
            posts = await this.postModel
                .find({})
                .sort({ createdAt: -1 })
                .limit(4)
                .populate('categories')
                .skip(3 * (page - 1));
            if (posts.length > 3) {
                hasMore = true;
            }
            posts = posts.slice(0, 3);
        }
        return {
            hasMore,
            posts: posts.map((p) => this.asDto(p, user)),
            page: page || 1,
        };
    }
    async getLastPosts(user) {
        const posts = await this.find({}, 6);
        return posts.map((p) => this.asDto(p, user));
    }
    async getPost(slug, user) {
        const post = await this.findOne({ slug });
        if (!post) {
            throw new common_1.NotFoundException(HttpError_1.HttpError.getHttpError(HttpError_1.HttpErrorCode.POST_NOT_FOUND));
        }
        return this.asDto(post, user);
    }
    async getLikedPosts(userId, authUser) {
        await this.usersService.getUserById(userId);
        this.usersService.isSelfOrAdmin(userId, authUser);
        const posts = await this.postModel.find({ likers: userId });
        return posts.map((p) => this.asBasicDto(p));
    }
    async getCommentedPosts(userId, authUser) {
        await this.usersService.getUserById(userId);
        this.usersService.isSelfOrAdmin(userId, authUser);
        const posts = await this.postModel.find({
            comments: { $elemMatch: { commenter: userId } },
        });
        return posts.map((p) => this.asDto(p));
    }
    async getQueriedPosts(search) {
        if (!search ||
            typeof search !== 'string' ||
            (search && search.length < 3)) {
            throw new common_1.BadRequestException(HttpError_1.HttpError.getHttpError(HttpError_1.HttpErrorCode.SEARCH_QUERY));
        }
        const query = _.escapeRegExp(search);
        const searchReg = new RegExp('.*' + query + '.*', 'i');
        const posts = await this.find({
            $or: [
                {
                    title: {
                        $regex: searchReg,
                    },
                },
                {
                    desc: {
                        $regex: searchReg,
                    },
                },
                {
                    slug: {
                        $regex: searchReg,
                    },
                },
            ],
        }, 5);
        return posts.map((p) => this.asBasicDto(p));
    }
    async commentPost(user, createCommentDto, slug) {
        if (!(await this.findOne({ slug }))) {
            throw new common_1.NotFoundException(HttpError_1.HttpError.getHttpError(HttpError_1.HttpErrorCode.POST_NOT_FOUND));
        }
        const post = await this.postModel
            .findOneAndUpdate({ slug }, {
            $addToSet: {
                comments: {
                    _id: new Mongoose.Types.ObjectId(),
                    commenter: user._id,
                    comment: createCommentDto.comment,
                    createdAt: Date.now(),
                },
            },
        }, { new: true })
            .populate('likers categories')
            .populate('comments.commenter', ['pseudo', 'picture']);
        return this.asDto(post, user);
    }
    async deletePostComment(user, slug, comment) {
        await this.usersService.isSelfOrAdmin(comment.commenterId.toString(), user);
        if (!(await this.findOne({ slug }))) {
            throw new common_1.NotFoundException(HttpError_1.HttpError.getHttpError(HttpError_1.HttpErrorCode.POST_NOT_FOUND));
        }
        const post = await this.postModel
            .findOneAndUpdate({ slug }, {
            $pull: {
                comments: { _id: new Mongoose.Types.ObjectId(comment._id) },
            },
        }, { new: true })
            .populate('categories likers')
            .populate('comments.commenter', ['pseudo', 'picture']);
        return this.asDto(post, user);
    }
    async updatePostComment(user, slug, comment) {
        await this.usersService.isSelfOrAdmin(comment.commenterId.toString(), user);
        if (!(await this.findOne({ slug }))) {
            throw new common_1.NotFoundException(HttpError_1.HttpError.getHttpError(HttpError_1.HttpErrorCode.POST_NOT_FOUND));
        }
        const post = await this.postModel
            .findOneAndUpdate({ slug }, {
            $set: {
                'comments.$[commentId].comment': comment.comment,
                'comments.$[commentId].updatedAt': Date.now(),
            },
        }, { new: true, arrayFilters: [{ 'commentId._id': comment._id }] })
            .populate('categories likers')
            .populate('comments.commenter', ['pseudo', 'picture']);
        return this.asDto(post, user);
    }
    async checkIfPostIsDuplicatedBySlug(slug) {
        const post = await this.findOne({ slug });
        return post ? this.asDto(post, null) : null;
    }
    async getPostLikeStatus(slug, user) {
        const post = await this.findOne({ slug });
        if (!post)
            return false;
        return !!post.likers.find((u) => u._id.toString() === user._id.toString());
    }
    async getCategorizedPosts(categoryName) {
        const category = await this.categoriesService.findOne({
            name: categoryName,
        });
        if (!category)
            return [];
        const posts = await this.postModel
            .find({ categories: category._id })
            .populate('categories');
        return posts.map((post) => this.asDto(post));
    }
    async find(match = {}, limit = 0) {
        if (match._id) {
            if (!(0, mongoose_2.isValidObjectId)(match._id)) {
                throw new common_1.BadRequestException(HttpError_1.HttpError.getHttpError(HttpError_1.HttpErrorCode.INVALID_ID));
            }
            else {
                match._id = new mongoose_2.Types.ObjectId(match._id);
            }
        }
        const docs = this.postModel
            .find(match, {
            _id: 1,
            title: 1,
            slug: 1,
            desc: 1,
            likers: 1,
            comments: 1,
            sourceName: 1,
            sourceLink: 1,
            picture: 1,
            categories: 1,
            createdAt: 1,
            updatedAt: 1,
        })
            .sort({ createdAt: -1 })
            .populate('categories likers')
            .populate('comments.commenter', ['pseudo', 'picture'])
            .sort({ createdAt: -1 });
        if (limit)
            docs.limit(limit);
        return docs;
    }
    async findOne(match) {
        const posts = await this.find(match);
        if (posts.length > 0) {
            return posts[0];
        }
        else {
            return null;
        }
    }
    asBasicDto(post) {
        return {
            slug: post.slug,
            title: post.title,
            desc: post.desc,
            picture: post.picture,
        };
    }
    asDto(post, authUser) {
        let likeStatus = false;
        if (authUser) {
            likeStatus = !!post.likers.find((u) => u._id.toString() === authUser._id.toString());
        }
        return {
            _id: post._id,
            slug: post.slug,
            title: post.title,
            categories: post.categories,
            likes: post.likers.length,
            authUserLiked: likeStatus,
            desc: post.desc,
            sourceName: post.sourceName,
            sourceLink: post.sourceLink,
            comments: post.comments,
            picture: post.picture,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        };
    }
};
PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(post_entity_1.Post.name)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => categories_service_1.CategoriesService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        google_service_1.GoogleService,
        users_service_1.UsersService,
        categories_service_1.CategoriesService])
], PostsService);
exports.PostsService = PostsService;
//# sourceMappingURL=posts.service.js.map