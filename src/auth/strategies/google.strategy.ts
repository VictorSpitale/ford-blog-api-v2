import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('google.client_id'),
      clientSecret: configService.get('google.secret'),
      callbackURL: configService.get('google.callback'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { name, emails } = profile;
    const user = {
      email: emails[0].value,
      pseudo: `${name.givenName} ${name.familyName}`,
      accessToken,
    };
    done(null, user);
  }
}
