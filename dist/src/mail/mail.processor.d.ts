import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { WelcomeEmailType } from './types/welcome.type';
import { PasswordRecoveryType } from './types/password-recovery.type';
import { ConfigService } from '@nestjs/config';
import { ContactDto } from './dto/Contact.dto';
export declare class MailProcessor {
    private readonly mailerService;
    private readonly configService;
    constructor(mailerService: MailerService, configService: ConfigService);
    handleWelcome(job: Job<WelcomeEmailType>): void;
    handleRecovery(job: Job<PasswordRecoveryType>): void;
    handleContact(job: Job<ContactDto>): Promise<void>;
}
