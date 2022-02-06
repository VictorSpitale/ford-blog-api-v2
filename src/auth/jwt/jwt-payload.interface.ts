export interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
}

export interface JwtAccessToken {
  access_token: string;
}
