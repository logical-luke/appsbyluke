import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {Resend} from 'resend';
import {SendEmailDto} from './dto/send-email';

@Injectable()
export class EmailService {
    private resend: Resend;
    private readonly toEmail: string;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('RESEND_API_KEY');
        this.logger.log(`API Key: ${apiKey ? 'Present' : 'Missing'}`);

        if (!apiKey) {
            throw new Error('RESEND_API_KEY is not set in the environment variables');
        }

        this.resend = new Resend(apiKey);
        this.toEmail = this.configService.get<string>('TO_EMAIL');

        if (!this.toEmail) {
            throw new Error('TO_EMAIL is not set in the environment variables');
        }
    }

    async sendEmail(emailDto: SendEmailDto) {
        const {senderEmail, senderName, message} = emailDto;
        try {
            const data = await this.resend.emails.send({
                from: 'onboarding@resend.dev',
                to: this.toEmail,
                subject: `New message from ${senderName}`,
                html: `
          <h1>New message from your website</h1>
          <p><strong>From:</strong> ${senderName} (${senderEmail})</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
            });
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}