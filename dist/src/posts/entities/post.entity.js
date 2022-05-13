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
exports.PostEntity = exports.Post = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const Mongoose = require("mongoose");
const category_entity_1 = require("../../categories/entities/category.entity");
const class_transformer_1 = require("class-transformer");
const user_entity_1 = require("../../users/entities/user.entity");
const regex_validation_1 = require("../../shared/utils/regex.validation");
let Post = class Post {
};
__decorate([
    (0, mongoose_1.Prop)({
        unique: true,
        required: true,
        type: String,
    }),
    __metadata("design:type", String)
], Post.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
    }),
    __metadata("design:type", String)
], Post.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                type: Mongoose.Types.ObjectId,
                ref: category_entity_1.Category.name,
            },
        ],
        required: true,
    }),
    (0, class_transformer_1.Type)(() => category_entity_1.Category),
    __metadata("design:type", Array)
], Post.prototype, "categories", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                type: Mongoose.Types.ObjectId,
                ref: user_entity_1.User.name,
            },
        ],
        default: [],
    }),
    (0, class_transformer_1.Type)(() => user_entity_1.User),
    __metadata("design:type", Array)
], Post.prototype, "likers", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Post.prototype, "desc", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Post.prototype, "sourceName", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        match: [regex_validation_1.urlRegex, 'Please set a valid source url'],
        required: true,
    }),
    __metadata("design:type", String)
], Post.prototype, "sourceLink", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                comment: {
                    type: String,
                },
                createdAt: {
                    type: Number,
                },
                updatedAt: {
                    type: String,
                    required: false,
                },
                commenter: {
                    type: Mongoose.Types.ObjectId,
                    ref: user_entity_1.User.name,
                },
            },
        ],
        default: [],
    }),
    (0, class_transformer_1.Type)(() => user_entity_1.User),
    __metadata("design:type", Array)
], Post.prototype, "comments", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        match: [regex_validation_1.urlRegex, 'Please set a valid source url'],
    }),
    __metadata("design:type", String)
], Post.prototype, "picture", void 0);
Post = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Post);
exports.Post = Post;
exports.PostEntity = mongoose_1.SchemaFactory.createForClass(Post)
    .set('timestamps', true)
    .set('versionKey', false);
//# sourceMappingURL=post.entity.js.map