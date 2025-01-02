import { Controller, Post, Body, Version } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  @Version('1')
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    return this.emailService.sendEmail(sendEmailDto);
  }
}