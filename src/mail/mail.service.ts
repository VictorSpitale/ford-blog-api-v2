import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectQueue('mailing') private readonly mailingQueue: Queue,
  ) {}

  async addWelcomeMailToQueue() {
    // await this.mailingQueue.add({
    //   name: 'John dodoodo',
    //   url: 'linkink',
    // });
  }
}
