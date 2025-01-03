import { Test, TestingModule } from '@nestjs/testing';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email';
import { CreateEmailResponse } from './dto/send-email';

describe('EmailController', () => {
  let controller: EmailController;
  let emailService: EmailService;

  const mockEmailService = {
    sendEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    controller = module.get<EmailController>(EmailController);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sendEmail', () => {
    it('should call emailService.sendEmail with the correct parameters', async () => {
      const sendEmailDto: SendEmailDto = {
        senderEmail: 'test@example.com',
        senderName: 'Test Sender',
        message: 'Test message',
      };

      const expectedResponse: CreateEmailResponse = {
        status: 'success',
        message: 'Email sent successfully',
      };

      mockEmailService.sendEmail.mockResolvedValue(expectedResponse);

      const result = await controller.sendEmail(sendEmailDto);

      expect(emailService.sendEmail).toHaveBeenCalledWith(sendEmailDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should throw an error if emailService.sendEmail throws', async () => {
      const sendEmailDto: SendEmailDto = {
        senderEmail: 'test@example.com',
        senderName: 'Test Sender',
        message: 'Test message',
      };

      const errorMessage = 'Failed to send email';
      mockEmailService.sendEmail.mockRejectedValue(new Error(errorMessage));

      await expect(controller.sendEmail(sendEmailDto)).rejects.toThrow(errorMessage);
    });
  });
});