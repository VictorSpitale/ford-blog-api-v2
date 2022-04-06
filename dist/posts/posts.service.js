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
const mongoose_2 = require("mongoose");
const google_service_1 = require("../cloud/google.service");
const upload_types_1 = require("../shared/types/upload.types");
let PostsService = class PostsService {
    constructor(postModel, googleService) {
        this.postModel = postModel;
        this.googleService = googleService;
    }
    async create(createPostDto, file) {
        if (await this.checkIfPostIsDuplicatedBySlug(createPostDto.slug)) {
            throw new common_1.ConflictException('post with this slug already exist');
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
    async getPosts(user) {
        const posts = await this.find({});
        return posts.map((p) => this.asDto(p, user));
    }
    async getLastPosts(user) {
        const posts = await this.find({}, 6);
        return posts.map((p) => this.asDto(p, user));
    }
    async getPost(slug, user) {
        const post = await this.findOne({ slug });
        if (!post) {
            throw new common_1.NotFoundException();
        }
        return this.asDto(post, user);
    }
    async getQueriedPosts(search) {
        if (!search || (search && search.length < 3)) {
            throw new common_1.BadRequestException('Search query is missing or should be more than 2 characters');
        }
        const searchReg = new RegExp('.*' + search + '.*', 'i');
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
        return posts.map((p) => this.asDto(p));
    }
    async checkIfPostIsDuplicatedBySlug(slug) {
        const post = await this.findOne({ slug });
        return post ? this.asDto(post, null) : null;
    }
    async find(match = {}, limit = 0) {
        if (match._id) {
            if (!(0, mongoose_2.isValidObjectId)(match._id)) {
                throw new common_1.BadRequestException();
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
            .populate('categories likers');
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
    __metadata("design:paramtypes", [mongoose_2.Model,
        google_service_1.GoogleService])
], PostsService);
exports.PostsService = PostsService;
//# sourceMappingURL=posts.service.js.map