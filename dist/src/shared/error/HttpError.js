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
exports.HttpError = exports.HttpErrorDto = exports.HttpValidationError = exports.HttpErrorCode = void 0;
const swagger_1 = require("@nestjs/swagger");
var HttpErrorCode;
(function (HttpErrorCode) {
    HttpErrorCode[HttpErrorCode["JWT_FAILED"] = 0] = "JWT_FAILED";
    HttpErrorCode[HttpErrorCode["UNAUTHORIZED_LOGIN"] = 1] = "UNAUTHORIZED_LOGIN";
    HttpErrorCode[HttpErrorCode["G_AUTH_FAILED"] = 2] = "G_AUTH_FAILED";
    HttpErrorCode[HttpErrorCode["USER_ALREADY_EXIST"] = 3] = "USER_ALREADY_EXIST";
    HttpErrorCode[HttpErrorCode["USER_NOT_FOUND"] = 4] = "USER_NOT_FOUND";
    HttpErrorCode[HttpErrorCode["POST_NOT_FOUND"] = 5] = "POST_NOT_FOUND";
    HttpErrorCode[HttpErrorCode["DUPLICATE_PSEUDO"] = 6] = "DUPLICATE_PSEUDO";
    HttpErrorCode[HttpErrorCode["DUPLICATE_SLUG"] = 7] = "DUPLICATE_SLUG";
    HttpErrorCode[HttpErrorCode["FILE_TOO_BIG"] = 8] = "FILE_TOO_BIG";
    HttpErrorCode[HttpErrorCode["FILE_FORMAT"] = 9] = "FILE_FORMAT";
    HttpErrorCode[HttpErrorCode["FAIL_UPLOAD"] = 10] = "FAIL_UPLOAD";
    HttpErrorCode[HttpErrorCode["ROLE_UNAUTHORIZED"] = 11] = "ROLE_UNAUTHORIZED";
    HttpErrorCode[HttpErrorCode["DUPLICATE_CATEGORY"] = 12] = "DUPLICATE_CATEGORY";
    HttpErrorCode[HttpErrorCode["INVALID_ID"] = 13] = "INVALID_ID";
    HttpErrorCode[HttpErrorCode["SEARCH_QUERY"] = 14] = "SEARCH_QUERY";
    HttpErrorCode[HttpErrorCode["CATEGORY_NOT_FOUND"] = 15] = "CATEGORY_NOT_FOUND";
})(HttpErrorCode = exports.HttpErrorCode || (exports.HttpErrorCode = {}));
class HttpValidationError {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Http status code',
        example: 400,
        required: true,
    }),
    __metadata("design:type", Number)
], HttpValidationError.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Http error messages',
        example: ['x must not be empty', 'x must be a string'],
        required: true,
    }),
    __metadata("design:type", Array)
], HttpValidationError.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Http error message',
        example: 'Error occurred',
        required: true,
    }),
    __metadata("design:type", String)
], HttpValidationError.prototype, "error", void 0);
exports.HttpValidationError = HttpValidationError;
class HttpErrorDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Http status code',
        example: 400,
        required: true,
    }),
    __metadata("design:type", Number)
], HttpErrorDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Http error message',
        example: 'Error occurred',
        required: true,
    }),
    __metadata("design:type", String)
], HttpErrorDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Error number',
        example: 6,
        required: true,
    }),
    __metadata("design:type", Number)
], HttpErrorDto.prototype, "code", void 0);
exports.HttpErrorDto = HttpErrorDto;
class HttpError {
    static getHttpError(code) {
        return this.errors.get(code);
    }
}
exports.HttpError = HttpError;
HttpError.errors = new Map([
    [
        HttpErrorCode.JWT_FAILED,
        { message: 'Jwt failed', statusCode: 401, code: 0 },
    ],
    [
        HttpErrorCode.UNAUTHORIZED_LOGIN,
        { message: 'Wrong email or password', statusCode: 401, code: 1 },
    ],
    [
        HttpErrorCode.G_AUTH_FAILED,
        { message: 'Authentication failed', statusCode: 401, code: 2 },
    ],
    [
        HttpErrorCode.USER_ALREADY_EXIST,
        { message: 'Pseudo or email already used', statusCode: 409, code: 3 },
    ],
    [
        HttpErrorCode.USER_NOT_FOUND,
        { message: 'User not found', statusCode: 404, code: 4 },
    ],
    [
        HttpErrorCode.POST_NOT_FOUND,
        { message: 'Post not found', statusCode: 404, code: 5 },
    ],
    [
        HttpErrorCode.DUPLICATE_PSEUDO,
        { message: 'Pseudo already used', statusCode: 409, code: 6 },
    ],
    [
        HttpErrorCode.DUPLICATE_SLUG,
        {
            message: 'Post with this slug already exist',
            statusCode: 409,
            code: 7,
        },
    ],
    [
        HttpErrorCode.FILE_TOO_BIG,
        {
            message: 'File is too big',
            statusCode: 400,
            code: 8,
        },
    ],
    [
        HttpErrorCode.FILE_FORMAT,
        {
            message: 'File format not supported',
            statusCode: 400,
            code: 9,
        },
    ],
    [
        HttpErrorCode.FAIL_UPLOAD,
        {
            message: 'File upload failed',
            statusCode: 500,
            code: 10,
        },
    ],
    [
        HttpErrorCode.ROLE_UNAUTHORIZED,
        {
            message: 'Insufficient permissions',
            statusCode: 401,
            code: 11,
        },
    ],
    [
        HttpErrorCode.DUPLICATE_CATEGORY,
        { message: 'Category already exist', statusCode: 409, code: 12 },
    ],
    [
        HttpErrorCode.INVALID_ID,
        { message: 'Invalid object id', statusCode: 400, code: 13 },
    ],
    [
        HttpErrorCode.SEARCH_QUERY,
        {
            message: 'Search query is missing or should be more than 2 characters',
            statusCode: 400,
            code: 14,
        },
    ],
    [
        HttpErrorCode.CATEGORY_NOT_FOUND,
        { message: 'Category not found', statusCode: 404, code: 15 },
    ],
]);
//# sourceMappingURL=HttpError.js.map