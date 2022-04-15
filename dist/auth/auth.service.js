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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const password_utils_1 = require("../shared/utils/password.utils");
const HttpError_1 = require("../shared/error/HttpError");
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async validateUser(email, password) {
        const user = await this.usersService.findOne({ email });
        if (!user || !(await user.checkPassword(password))) {
            throw new common_1.UnauthorizedException(HttpError_1.HttpError.getHttpError(HttpError_1.HttpErrorCode.UNAUTHORIZED_LOGIN));
        }
        return this.usersService.asDtoWithoutPassword(user);
    }
    signToken(user) {
        const payload = { email: user.email, sub: user._id };
        return this.jwtService.sign(payload);
    }
    async verifyPayload(payload) {
        const user = await this.usersService.findOne({ _id: payload.sub });
        if (!user) {
            throw new common_1.UnauthorizedException('No user');
        }
        return this.usersService.asDtoWithoutPassword(user);
    }
    async decodePayload(jwtToken) {
        var _a;
        return (_a = this.jwtService.decode(jwtToken)) === null || _a === void 0 ? void 0 : _a.sub;
    }
    async login(user) {
        const payload = { email: user.email, sub: user._id };
        return { access_token: this.jwtService.sign(payload) };
    }
    async setCookieFromGoogle(response, token) {
        if (await this.decodePayload(token)) {
            return this.setCookie(response, token);
        }
        throw new common_1.BadRequestException(HttpError_1.HttpError.getHttpError(HttpError_1.HttpErrorCode.G_AUTH_FAILED));
    }
    setCookie(response, value, body) {
        return response
            .cookie('access_token', value, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
            sameSite: 'none',
            secure: true,
            httpOnly: true,
        })
            .send(body);
    }
    async googleLogin(req, res) {
        if (!req.user) {
            return 'No user from google';
        }
        let userDto;
        try {
            userDto = await this.usersService.create({
                email: req.user.email,
                pseudo: req.user.pseudo.substring(0, 18),
                password: (0, password_utils_1.uuid)(),
            });
        }
        catch (e) {
            if (e.status !== 409) {
                return res.redirect(`${this.configService.get('google.client_url')}/login?status=failed`);
            }
            else {
                userDto = await this.usersService.getUserByEmail(req.user.email);
            }
        }
        try {
            const { access_token } = await this.login(userDto);
            return res.redirect(`${this.configService.get('google.client_url')}/account?token=${access_token}`);
        }
        catch (e) {
            return res.redirect(`${this.configService.get('google.client_url')}/login?status=failed`);
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map