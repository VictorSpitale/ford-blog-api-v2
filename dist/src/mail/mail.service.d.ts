import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';
import { WelcomeEmailInfos } from './types/welcome.type';
import { PasswordRecoveryInfos } from './types/password-recovery.type';
import { ContactDto } from './dto/Contact.dto';
export declare class MailService {
    private readonly configService;
    private readonly mailingQueue;
    constructor(configService: ConfigService, mailingQueue: Queue);
    addWelcomeMailToQueue(welcomeMailInfos: WelcomeEmailInfos): Promise<void>;
    addPasswordRecoveryEmailToQueue(recoveryInfos: PasswordRecoveryInfos): Promise<void>;
    addContactEmailToQueue(contactDto: ContactDto): Promise<void>;
}
