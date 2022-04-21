import { MailerService } from '@nestjs-modules/mailer';
import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';
import { WelcomeEmailInfos } from './types/welcome.type';
import { PasswordRecoveryInfos } from './types/password-recovery.type';
export declare class MailService {
    private readonly mailerService;
    private readonly configService;
    private readonly mailingQueue;
    constructor(mailerService: MailerService, configService: ConfigService, mailingQueue: Queue);
    addWelcomeMailToQueue(welcomeMailInfos: WelcomeEmailInfos): Promise<void>;
    addPasswordRecoveryEmailToQueue(recoveryInfos: PasswordRecoveryInfos): Promise<void>;
}
