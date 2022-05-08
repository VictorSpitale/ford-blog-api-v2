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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const local_auth_guard_1 = require("./guards/local-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const user_decorator_1 = require("../users/user.decorator");
const user_dto_1 = require("../users/dto/user.dto");
const allow_any_decorator_1 = require("./decorators/allow-any.decorator");
const passport_1 = require("@nestjs/passport");
const users_service_1 = require("../users/users.service");
const login_user_dto_1 = require("../users/dto/login-user.dto");
const HttpError_1 = require("../shared/error/HttpError");
let AuthController = class AuthController {
    constructor(authService, usersService) {
        this.authService = authService;
        this.usersService = usersService;
    }
    async login(authUser, response) {
        const { access_token } = await this.authService.login(authUser);
        const user = await this.usersService.getUserById(authUser._id.toString());
        return this.authService.setCookie(response, access_token, user);
    }
    async logout(response) {
        return this.authService.logout(response);
    }
    async verifyToken(req) {
        var _a;
        const id = await this.authService.decodePayload((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.access_token);
        return this.usersService.getUserById(id);
    }
    async setCookieFromGoogle(res, token) {
        return this.authService.setCookieFromGoogle(res, token);
    }
    async googleAuth(req) { }
    googleAuthRedirect(req, res) {
        return this.authService.googleLogin(req, res);
    }
};
__decorate([
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, allow_any_decorator_1.AllowAny)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get an access token for a user' }),
    (0, swagger_1.ApiBody)({
        description: "User's credentials",
        required: true,
        type: login_user_dto_1.LoginUserDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Setting jwt cookie',
    }),
    (0, swagger_1.ApiResponse)({
        description: 'Bad credentials',
        status: 401,
        type: HttpError_1.HttpErrorDto,
    }),
    __param(0, (0, user_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UserDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('logout'),
    (0, swagger_1.ApiOperation)({ summary: 'Logout a user' }),
    (0, swagger_1.ApiResponse)({
        description: 'Removing the jwt cookie',
        status: 200,
    }),
    (0, swagger_1.ApiResponse)({
        description: 'Jwt failed',
        status: 401,
        type: HttpError_1.HttpErrorDto,
    }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('/jwt'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user information by its jwt cookie' }),
    (0, swagger_1.ApiResponse)({
        description: 'User information',
        status: 200,
        type: user_dto_1.UserDto,
    }),
    (0, swagger_1.ApiResponse)({
        description: 'Jwt failed',
        status: 401,
        type: HttpError_1.HttpErrorDto,
    }),
    (0, swagger_1.ApiResponse)({
        description: 'User not found',
        status: 404,
        type: HttpError_1.HttpErrorDto,
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyToken", null);
__decorate([
    (0, common_1.Get)('/g-jwt/:token'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, allow_any_decorator_1.AllowAny)(),
    (0, swagger_1.ApiOperation)({ summary: 'Set jwt cookie on Google Auth' }),
    (0, swagger_1.ApiParam)({
        description: 'Jwt token',
        required: true,
        type: String,
        name: 'token',
    }),
    (0, swagger_1.ApiResponse)({
        description: 'Setting jwt on Google Auth',
        status: 200,
    }),
    (0, swagger_1.ApiResponse)({
        description: 'Google Auth failed',
        status: 400,
        type: HttpError_1.HttpErrorDto,
    }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "setCookieFromGoogle", null);
__decorate([
    (0, common_1.Get)('/google'),
    (0, allow_any_decorator_1.AllowAny)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    (0, swagger_1.ApiOperation)({ summary: 'Redirect to Google Auth' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('/google/redirect'),
    (0, allow_any_decorator_1.AllowAny)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    (0, swagger_1.ApiOperation)({
        summary: 'Redirect to the front-end application after Google Auth',
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "googleAuthRedirect", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, swagger_1.ApiTags)('Auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map