import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('mailing')
export class MailProcessor {
  constructor(private readonly mailerService: MailerService) {}

  @Process()
  handleMailing(job: Job) {
    // try {
    //   this.mailerService
    //     .sendMail({
    //       to: 'vmairets@gmail.com',
    //       from: '"Ford Universe Team" <no-reply@forduniverse.com>',
    //       subject: 'Welcome on Ford Universe !',
    //       template: 'welcome',
    //       context: {
    //         name: job.data.name,
    //         url: job.data.url,
    //       },
    //     })
    //     .then(() => null)
    //     .catch(() => null);
    // } catch (e) {}
  }
}
