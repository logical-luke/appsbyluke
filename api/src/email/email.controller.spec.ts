import { Test, TestingModule } from '@nestjs/testing';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email';
import { CreateEmailResponse } from './dto/send-email';

describe('EmailController', () => {
  let emailController: EmailController;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [
        {
          provide: EmailService,
          useValue: {
            sendEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    emailController = module.get<EmailController>(EmailController);
    emailService = module.get<EmailService>(EmailService);
  });

  describe('sendEmail', () => {
    it('should send email successfully', async () => {
      const sendEmailDto: SendEmailDto = { senderEmail: 'test@example.com', senderName: 'Test User', message: 'Test body' };
      const response: CreateEmailResponse = { status: 'success', message: 'Email sent successfully' };
      jest.spyOn(emailService, 'sendEmail').mockResolvedValue(response);

      const result = await emailController.sendEmail(sendEmailDto);
      expect(result).toEqual(response);
      expect(emailService.sendEmail).toHaveBeenCalledWith(sendEmailDto);
    });

    it('should fail to send email', async () => {
      const sendEmailDto: SendEmailDto = { senderEmail: 'test@example.com', senderName: 'Test User', message: 'Test body' };
      const error = new Error('Failed to send email');
      jest.spyOn(emailService, 'sendEmail').mockRejectedValue(error);

      try {
        await emailController.sendEmail(sendEmailDto);
      } catch (err) {
        expect(err).toBe(error);
      }
      expect(emailService.sendEmail).toHaveBeenCalledWith(sendEmailDto);
    });
  });
});