import { ApiProperty } from '@nestjs/swagger';

export enum HttpErrorCode {
  JWT_FAILED,
  UNAUTHORIZED_LOGIN,
  G_AUTH_FAILED,
  USER_ALREADY_EXIST,
  USER_NOT_FOUND,
  POST_NOT_FOUND,
  DUPLICATE_PSEUDO,
  DUPLICATE_SLUG,
  FILE_TOO_BIG,
  FILE_FORMAT,
  FAIL_UPLOAD,
  ROLE_UNAUTHORIZED,
  DUPLICATE_CATEGORY,
  INVALID_ID,
  SEARCH_QUERY,
  CATEGORY_NOT_FOUND,
}
export class HttpValidationError {
  @ApiProperty({
    type: Number,
    description: 'Http status code',
    example: 400,
    required: true,
  })
  statusCode: number;

  @ApiProperty({
    type: String,
    description: 'Http error messages',
    example: ['x must not be empty', 'x must be a string'],
    required: true,
  })
  message: string[];

  @ApiProperty({
    type: String,
    description: 'Http error message',
    example: 'Error occurred',
    required: true,
  })
  error: string;
}

export class HttpErrorDto {
  @ApiProperty({
    type: Number,
    description: 'Http status code',
    example: 400,
    required: true,
  })
  statusCode: number;

  @ApiProperty({
    type: String,
    description: 'Http error message',
    example: 'Error occurred',
    required: true,
  })
  message: string;

  @ApiProperty({
    type: Number,
    description: 'Error number',
    example: 6,
    required: true,
  })
  code: number;
}

export class HttpError {
  private static errors = new Map<HttpErrorCode, HttpErrorDto>([
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

  public static getHttpError(code: HttpErrorCode) {
    return this.errors.get(code);
  }
}
