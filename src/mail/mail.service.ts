import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';
import { WelcomeEmailInfos, WelcomeEmailType } from './types/welcome.type';
import {
  PasswordRecoveryInfos,
  PasswordRecoveryType,
} from './types/password-recovery.type';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    @InjectQueue('mailing') private readonly mailingQueue: Queue,
  ) {}

  async addWelcomeMailToQueue(welcomeMailInfos: WelcomeEmailInfos) {
    await this.mailingQueue.add('welcome', {
      pseudo: welcomeMailInfos.pseudo,
      mailTo: welcomeMailInfos.mailTo,
      clientUrl: this.configService.get('client_url'),
    } as WelcomeEmailType);
  }

  async addPasswordRecoveryEmailToQueue(recoveryInfos: PasswordRecoveryInfos) {
    await this.mailingQueue.add('recovery', {
      pseudo: recoveryInfos.pseudo,
      mailTo: recoveryInfos.mailTo,
      token: recoveryInfos.token,
      clientUrl: this.configService.get('client_url'),
      locale: recoveryInfos.locale,
    } as PasswordRecoveryType);
  }
}
