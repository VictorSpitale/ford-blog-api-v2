import { MailService } from './mail.service';
import { ContactDto } from './dto/Contact.dto';
export declare class MailController {
    private readonly mailService;
    constructor(mailService: MailService);
    contactMail(contactDto: ContactDto): Promise<void>;
}
