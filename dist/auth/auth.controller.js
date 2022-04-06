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
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(user, response) {
        const { access_token } = await this.authService.login(user);
        return response
            .cookie('access_token', access_token, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
            sameSite: 'none',
            secure: true,
            httpOnly: true,
        })
            .send({ access_token });
    }
    async verifyToken(req) {
        var _a;
        return this.authService.decodePayload((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.access_token);
    }
    async setCookieFromGoogle(res, token) {
        if (await this.authService.decodePayload(token)) {
            return res
                .cookie('access_token', token, {
                httpOnly: true,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
                secure: true,
                sameSite: 'none',
            })
                .send();
        }
        throw new common_1.BadRequestException();
    }
    async getProfile(user) {
        return user;
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
    __param(0, (0, user_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UserDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('/jwt'),
    (0, allow_any_decorator_1.AllowAny)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyToken", null);
__decorate([
    (0, common_1.Get)('/g-jwt/:token'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, allow_any_decorator_1.AllowAny)(),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "setCookieFromGoogle", null);
__decorate([
    (0, common_1.Get)('/me'),
    __param(0, (0, user_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('/google'),
    (0, allow_any_decorator_1.AllowAny)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('/google/redirect'),
    (0, allow_any_decorator_1.AllowAny)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "googleAuthRedirect", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, swagger_1.ApiTags)('Auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map