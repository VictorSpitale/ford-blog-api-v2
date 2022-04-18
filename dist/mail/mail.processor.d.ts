import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { WelcomeEmailType } from './types/welcome.type';
export declare class MailProcessor {
    private readonly mailerService;
    constructor(mailerService: MailerService);
    handleMailing(job: Job<WelcomeEmailType>): void;
}
