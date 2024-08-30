import { MailerService } from '@nestjs-modules/mailer';
import { Inject } from '@nestjs/common';

export class EmailService {
  @Inject()
  private readonly mailService: MailerService;
  async sendOtp(to: string, otp: string) {
    await this.mailService.sendMail({
      to: to,
      subject: 'Aktivasi Akun Diengs.id',
      template: './sendotp',
      context: {
        otp: otp,
      },
    });
  }
}
