import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { WelcomeEmailType } from './types/welcome.type';
import { PasswordRecoveryType } from './types/password-recovery.type';
import { ConfigService } from '@nestjs/config';
import { ContactDto } from './dto/Contact.dto';

@Processor('mailing')
export class MailProcessor {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  @Process('welcome')
  handleWelcome(job: Job<WelcomeEmailType>) {
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

  @Process('recovery')
  handleRecovery(job: Job<PasswordRecoveryType>) {
    try {
      const subject =
        job.data.locale === 'fr'
          ? 'Réinitialisation de mot de passe'
          : 'Password recovery';
      this.mailerService
        .sendMail({
          to: job.data.mailTo,
          from: '"Ford Universe Team" <no-reply@forduniverse.com>',
          subject,
          template: `passwordRecovery-${job.data.locale}`,
          context: {
            name: job.data.pseudo,
            link: `${job.data.clientUrl}/recovery/${job.data.locale}/${job.data.token}`,
          },
        })
        .then(() => null)
        .catch(() => null);
    } catch (e) {}
  }

  @Process('contact')
  async handleContact(job: Job<ContactDto>) {
    await this.mailerService.sendMail({
      to: this.configService.get('email.to'),
      from: job.data.email,
      template: 'contact',
      subject: `Ford Blog : Message de ${job.data.name} | ${job.data.email}`,
      context: {
        message: job.data.message,
      },
    });
  }
}
