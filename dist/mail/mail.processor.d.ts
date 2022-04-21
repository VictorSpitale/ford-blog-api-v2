import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { WelcomeEmailType } from './types/welcome.type';
import { PasswordRecoveryType } from './types/password-recovery.type';
export declare class MailProcessor {
    private readonly mailerService;
    constructor(mailerService: MailerService);
    handleWelcome(job: Job<WelcomeEmailType>): void;
    handleRecovery(job: Job<PasswordRecoveryType>): void;
}
