export enum HttpErrorCode {
  JWT_FAILED,
  UNAUTHORIZED_LOGIN,
  G_AUTH_FAILED,
  USER_ALREADY_EXIST,
  USER_NOT_FOUND,
  POST_NOT_FOUND,
}

type HttpErrorObj = {
  statusCode: number;
  message: string;
  code: number;
};

export class HttpError {
  private static errors = new Map<HttpErrorCode, HttpErrorObj>([
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
  ]);

  public static getHttpError(code: HttpErrorCode) {
    return this.errors.get(code);
  }
}
