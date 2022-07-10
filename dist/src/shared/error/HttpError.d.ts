export declare enum HttpErrorCode {
    JWT_FAILED = 0,
    UNAUTHORIZED_LOGIN = 1,
    G_AUTH_FAILED = 2,
    USER_ALREADY_EXIST = 3,
    USER_NOT_FOUND = 4,
    POST_NOT_FOUND = 5,
    DUPLICATE_PSEUDO = 6,
    DUPLICATE_SLUG = 7,
    FILE_TOO_BIG = 8,
    FILE_FORMAT = 9,
    FAIL_UPLOAD = 10,
    ROLE_UNAUTHORIZED = 11,
    DUPLICATE_CATEGORY = 12,
    INVALID_ID = 13,
    SEARCH_QUERY = 14,
    CATEGORY_NOT_FOUND = 15
}
export declare class HttpValidationError {
    statusCode: number;
    message: string[];
    error: string;
}
export declare class HttpErrorDto {
    statusCode: number;
    message: string;
    code: number;
}
export declare class HttpError {
    private static errors;
    static getHttpError(code: HttpErrorCode): HttpErrorDto;
}
