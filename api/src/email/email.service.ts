import {Injectable, Logger} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {Resend} from 'resend';
import {SendEmailDto} from './dto/send-email';
import {AddToWaitlistDto} from "../waitlist/dto/add-to-waitlist.dto";
import {ProductName} from '../orders/entities/order.entity';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class EmailService {
    private resend: Resend;
    private readonly logger = new Logger(EmailService.name);
    private readonly toEmail: string;
    private readonly fromEmail: string;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('RESEND_API_KEY');
        this.logger.log(`API Key: ${apiKey ? 'Present' : 'Missing'}`);

        if (!apiKey) {
            throw new Error('RESEND_API_KEY is not set in the environment variables');
        }

        this.resend = new Resend(apiKey);
        this.toEmail = this.configService.get<string>('TO_EMAIL');
        this.fromEmail = 'Luke <luke@appsbyluke.com>';

        if (!this.toEmail) {
            throw new Error('TO_EMAIL is not set in the environment variables');
        }
    }

    async sendOrderConfirmation(customerEmail: string, productName: ProductName) {
        const pdfMapping = {
            [ProductName.STARTUP_CORE]: 'startup-core.pdf',
            [ProductName.STARTUP_PLUS]: 'startup-plus.pdf',
            [ProductName.STARTUP_PRO]: 'startup-pro.pdf',
            [ProductName.CICD_INTEGRATION]: 'ci-cd-integration.pdf',
            [ProductName.INFRASTRUCTURE_SETUP]: 'infrastructure_setup.pdf',
        };

        const productDisplayNames = {
            [ProductName.STARTUP_CORE]: 'Startup Core',
            [ProductName.STARTUP_PLUS]: 'Startup Plus',
            [ProductName.STARTUP_PRO]: 'Startup Pro',
            [ProductName.CICD_INTEGRATION]: 'CI/CD Integration',
            [ProductName.INFRASTRUCTURE_SETUP]: 'Infrastructure Setup',
        };

        const pdfPath = path.join(process.cwd(), 'assets', 'pdfs', pdfMapping[productName]);
        const pdfAttachment = fs.readFileSync(pdfPath);

        const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb; margin-bottom: 24px;">Thank You for Your Purchase!</h1>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Hi,
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Thank you for choosing ${productDisplayNames[productName]}! I'm excited to work with you and help bring your project to life.
            </p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 24px 0;">
                <h2 style="color: #1f2937; margin-top: 0;">Next Steps:</h2>
                <ol style="color: #374151; padding-left: 20px;">
                    <li style="margin-bottom: 12px;">
                        Please review the attached PDF document carefully - it contains detailed instructions and requirements for your project
                    </li>
                    <li style="margin-bottom: 12px;">
                        Send your project requirements (as outlined in the PDF) to <a href="mailto:luke@appsbyluke.com" style="color: #2563eb; text-decoration: underline;">luke@appsbyluke.com</a>
                    </li>
                    <li style="margin-bottom: 12px;">
                        Schedule our kick-off meeting using <a href="https://calendar.app.google/uDz6rZrYgUxqAC2i9" style="color: #2563eb; text-decoration: underline;">my calendar</a>
                    </li>
                </ol>
            </div>
            
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #d97706;">
                <p style="color: #92400e; font-size: 14px; line-height: 1.6; margin: 0;">
                    <strong>Important Note:</strong> The development timeline (${productDisplayNames[productName]} - as specified in the PDF) will commence after our kick-off meeting and once all requirements are confirmed.
                </p>
            </div>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                If you have any questions before our meeting, feel free to reach out to me directly at luke@appsbyluke.com.
            </p>
            
            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="color: #4b5563; font-size: 14px;">
                    Best regards,<br>
                    Luke<br>
                </p>
            </div>
        </div>
    `;

        try {
            return await this.resend.emails.send({
                from: this.fromEmail,
                to: customerEmail,
                subject: `Welcome to ${productDisplayNames[productName]} - Next Steps`,
                html: html,
                attachments: [
                    {
                        filename: pdfMapping[productName],
                        content: pdfAttachment,
                    },
                ],
            });
        } catch (error) {
            this.logger.error(`Failed to send order confirmation email: ${error.message}`);
            throw error;
        }
    }

    async sendEmail(emailDto: SendEmailDto) {
        const {senderEmail, senderName, message} = emailDto;
        try {
            return await this.resend.emails.send({
                from: 'Luke <luke@appsbyluke.com>',
                to: this.toEmail,
                subject: `New message from ${senderName}`,
                html: `
                  <h1>New message from your website</h1>
                  <p><strong>From:</strong> ${senderName} (${senderEmail})</p>
                  <p><strong>Message:</strong></p>
                  <p>${message}</p>
                `,
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}