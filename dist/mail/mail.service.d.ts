import { MailerService } from '@nestjs-modules/mailer';
import { Queue } from 'bull';
export declare class MailService {
    private readonly mailerService;
    private readonly mailingQueue;
    constructor(mailerService: MailerService, mailingQueue: Queue);
    addWelcomeMailToQueue(): Promise<void>;
}
