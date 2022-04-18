import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { WelcomeEmailType } from './types/welcome.type';

@Processor('mailing')
export class MailProcessor {
  constructor(private readonly mailerService: MailerService) {}

  @Process('welcome')
  handleMailing(job: Job<WelcomeEmailType>) {
    try {
      this.mailerService
        .sendMail({
          to: job.data.mailTo,
          from: '"Ford Universe Team" <no-reply@forduniverse.com>',
          subject: 'Welcome on Ford Universe !',
          template: 'welcome',
          context: {
            name: job.data.pseudo,
            url: job.data.clientUrl,
          },
        })
        .then(() => null)
        .catch(() => null);
    } catch (e) {}
  }
}
