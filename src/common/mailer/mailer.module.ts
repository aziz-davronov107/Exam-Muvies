import { MailerModule as NestMailer } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerService } from './mailer.service';

@Global()
@Module({
  imports: [
    NestMailer.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: 'azizdavronov2005@gmail.com',
          pass: 'ptdu ayaq rjrm svau',
        },
      },
      defaults: {
        from: 'Yandiev commpani <azizdavronov2005@gmail.com>',
      },
      template: {
        dir: join(process.cwd(), 'src', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
