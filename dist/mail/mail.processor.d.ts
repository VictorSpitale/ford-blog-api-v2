import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
export declare class MailProcessor {
    private readonly mailerService;
    constructor(mailerService: MailerService);
    handleMailing(job: Job): void;
}
