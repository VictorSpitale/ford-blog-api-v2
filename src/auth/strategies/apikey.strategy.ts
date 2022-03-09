import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { AuthService } from '../auth.service';

@Injectable()
export class ApikeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
  constructor(private readonly authService: AuthService) {
    super({ header: 'x-api-key', prefix: '' }, true, (apiKey, verified) => {
      const checkKey = authService.validateApiKey(apiKey);
      if (!checkKey) {
        throw new UnauthorizedException('Api Key Unauthorized');
      }
      return verified(true);
    });
  }
}
