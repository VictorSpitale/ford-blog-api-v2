import { Injectable } from '@nestjs/common';

@Injectable()
export class MailServiceMock {
  async addWelcomeMailToQueue() {
    return;
  }

  async addPasswordRecoveryEmailToQueue() {
    return;
  }
}
