"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsModule = void 0;
const common_1 = require("@nestjs/common");
const posts_service_1 = require("./posts.service");
const posts_controller_1 = require("./posts.controller");
const mongoose_1 = require("@nestjs/mongoose");
const post_entity_1 = require("./entities/post.entity");
const google_service_1 = require("../cloud/google.service");
const users_module_1 = require("../users/users.module");
const categories_module_1 = require("../categories/categories.module");
let PostsModule = class PostsModule {
};
PostsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
            (0, common_1.forwardRef)(() => categories_module_1.CategoriesModule),
            mongoose_1.MongooseModule.forFeature([{ name: post_entity_1.Post.name, schema: post_entity_1.PostEntity }]),
        ],
        controllers: [posts_controller_1.PostsController],
        providers: [posts_service_1.PostsService, google_service_1.GoogleService],
        exports: [posts_service_1.PostsService],
    })
], PostsModule);
exports.PostsModule = PostsModule;
//# sourceMappingURL=posts.module.js.map