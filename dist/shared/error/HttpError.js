"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = exports.HttpErrorCode = void 0;
var HttpErrorCode;
(function (HttpErrorCode) {
    HttpErrorCode[HttpErrorCode["JWT_FAILED"] = 0] = "JWT_FAILED";
    HttpErrorCode[HttpErrorCode["UNAUTHORIZED_LOGIN"] = 1] = "UNAUTHORIZED_LOGIN";
    HttpErrorCode[HttpErrorCode["G_AUTH_FAILED"] = 2] = "G_AUTH_FAILED";
    HttpErrorCode[HttpErrorCode["USER_ALREADY_EXIST"] = 3] = "USER_ALREADY_EXIST";
})(HttpErrorCode = exports.HttpErrorCode || (exports.HttpErrorCode = {}));
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
]);
//# sourceMappingURL=HttpError.js.map