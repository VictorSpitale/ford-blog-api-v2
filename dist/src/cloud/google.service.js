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
var GoogleService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleService = void 0;
const common_1 = require("@nestjs/common");
const storage_1 = require("@google-cloud/storage");
const config_1 = require("@nestjs/config");
const upload_types_1 = require("../shared/types/upload.types");
const HttpError_1 = require("../shared/error/HttpError");
let GoogleService = GoogleService_1 = class GoogleService {
    constructor(configService) {
        this.configService = configService;
        this.storage = undefined;
        if (!this.storage) {
            this.storage = new storage_1.Storage({
                projectId: configService.get('google.storage.project_name'),
                credentials: {
                    private_key: configService
                        .get('google.storage.private_key')
                        .toString()
                        .replace(/\\n/g, '\n'),
                    client_email: configService.get('google.storage.client_email'),
                },
            });
        }
    }
    async uploadFile(file, name, type) {
        if (file.size > 500000) {
            throw new common_1.BadRequestException(HttpError_1.HttpError.getHttpError(HttpError_1.HttpErrorCode.FILE_TOO_BIG));
        }
        if (file.mimetype !== 'image/jpeg' &&
            file.mimetype !== 'image/jpeg' &&
            file.mimetype !== 'image/png') {
            throw new common_1.BadRequestException(HttpError_1.HttpError.getHttpError(HttpError_1.HttpErrorCode.FILE_FORMAT));
        }
        try {
            const bucket = this.storage.bucket(this.configService.get('google.bucket_name'));
            const folder = GoogleService_1.getFolder(type);
            const path = folder + name + '.jpg';
            const fileCloud = this.storage
                .bucket(this.configService.get('google.bucket_name'))
                .file(path);
            await fileCloud.save(file.buffer, {
                contentType: 'image/jpg',
            });
            return `https://storage.googleapis.com/${bucket.name}/${path}`;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(HttpError_1.HttpError.getHttpError(HttpError_1.HttpErrorCode.FAIL_UPLOAD));
        }
    }
    async deleteFile(name, type) {
        try {
            const bucket = this.storage.bucket(this.configService.get('google.bucket_name'));
            const folder = GoogleService_1.getFolder(type);
            const path = folder + name + '.jpg';
            const fileCloud = bucket.file(path);
            await fileCloud.delete();
        }
        catch (e) { }
    }
    static getFolder(type) {
        switch (type) {
            case upload_types_1.UploadTypes.POST:
                return 'posts/';
            case upload_types_1.UploadTypes.USER:
                return 'users/';
            default:
                return '';
        }
    }
};
GoogleService = GoogleService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GoogleService);
exports.GoogleService = GoogleService;
//# sourceMappingURL=google.service.js.map