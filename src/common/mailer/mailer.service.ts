import { Injectable } from '@nestjs/common';
import { MailerService as NestService } from '@nestjs-modules/mailer';

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: NestService) {}

  async sendMailer(options: any) {
    await this.mailerService.sendMail({
      to: options.to,
      subject: 'Enter this code!',
      template: 'index',
      context: {
        code: options.code,
      },
    });
  }
}
