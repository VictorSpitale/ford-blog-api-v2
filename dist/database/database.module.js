"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DatabaseModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const database_service_1 = require("./database.service");
let DatabaseModule = DatabaseModule_1 = class DatabaseModule {
    static forRoot() {
        return {
            module: DatabaseModule_1,
            imports: [
                mongoose_1.MongooseModule.forRootAsync({
                    useFactory: (configService) => {
                        const dbConfig = configService.get('database');
                        return {
                            uri: 'mongodb+srv://' +
                                dbConfig.username +
                                ':' +
                                dbConfig.password +
                                '@' +
                                dbConfig.host +
                                '/' +
                                (configService.get('NODE_ENV') === 'test'
                                    ? dbConfig.test_name
                                    : dbConfig.name),
                        };
                    },
                    inject: [config_1.ConfigService],
                }),
            ],
            controllers: [],
            providers: [database_service_1.DatabaseService],
            exports: [database_service_1.DatabaseService],
        };
    }
};
DatabaseModule = DatabaseModule_1 = __decorate([
    (0, common_1.Module)({})
], DatabaseModule);
exports.DatabaseModule = DatabaseModule;
//# sourceMappingURL=database.module.js.map