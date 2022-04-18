import { MailerService } from '@nestjs-modules/mailer';
import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';
import { WelcomeEmailInfos } from './types/welcome.type';
export declare class MailService {
    private readonly mailerService;
    private readonly configService;
    private readonly mailingQueue;
    constructor(mailerService: MailerService, configService: ConfigService, mailingQueue: Queue);
    addWelcomeMailToQueue(welcomeMailInfos: WelcomeEmailInfos): Promise<void>;
}
