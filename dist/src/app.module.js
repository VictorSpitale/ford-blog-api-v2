"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const config_2 = require("./config/config");
const database_module_1 = require("./database/database.module");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const posts_module_1 = require("./posts/posts.module");
const categories_module_1 = require("./categories/categories.module");
const core_1 = require("@nestjs/core");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
const roles_guard_1 = require("./auth/guards/roles.guard");
const mail_module_1 = require("./mail/mail.module");
const bull_1 = require("@nestjs/bull");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: '.development.env',
                load: [config_2.default],
                isGlobal: true,
            }),
            bull_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => {
                    return {
                        redis: {
                            host: configService.get('redis.host'),
                            port: configService.get('redis.port'),
                            username: configService.get('redis.username'),
                            password: configService.get('redis.password'),
                        },
                    };
                },
                inject: [config_1.ConfigService],
            }),
            database_module_1.DatabaseModule.forRoot(),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            posts_module_1.PostsModule,
            categories_module_1.CategoriesModule,
            mail_module_1.MailModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useExisting: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useExisting: roles_guard_1.RolesGuard,
            },
            jwt_auth_guard_1.JwtAuthGuard,
            roles_guard_1.RolesGuard,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map