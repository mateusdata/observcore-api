import { Test, TestingModule } from '@nestjs/testing';
import { EmailsService } from './emails.service';
import { MailerService } from '@nestjs-modules/mailer';

describe('EmailsService', () => {
  let service: EmailsService;
  let mailerService: MailerService;

  const mockMailerService = {
    sendMail: jest.fn(),
  };

  beforeEach(async () => {
    process.env.SMTP_FROM = 'noreply@observcore.com';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailsService,
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
      ],
    }).compile();

    service = module.get<EmailsService>(EmailsService);
    mailerService = module.get<MailerService>(MailerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should send email successfully', async () => {
      const createEmailDto = {
        to: 'user@example.com',
        subject: 'Test Subject',
        text: 'Test text content',
        body: '<p>Test HTML content</p>',
      };

      mockMailerService.sendMail.mockResolvedValue({ messageId: 'msg-123' });

      const result = await service.create(createEmailDto);

      expect(result).toHaveProperty('messageId');
      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        to: 'user@example.com',
        subject: 'Test Subject',
        text: 'Test text content',
        html: '<p>Test HTML content</p>',
        from: 'noreply@observcore.com',
      });
    });

    it('should send critical alert email', async () => {
      const createEmailDto = {
        to: 'admin@example.com',
        subject: 'CRITICAL Alert - ObservCore',
        text: 'Critical anomaly detected in CPU Usage metric',
        body: '<h1>Critical Alert</h1><p>Z-Score: 8.5</p>',
      };

      mockMailerService.sendMail.mockResolvedValue({ messageId: 'alert-msg-123' });

      const result = await service.create(createEmailDto);

      expect(mockMailerService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'admin@example.com',
          subject: expect.stringContaining('CRITICAL'),
        })
      );
    });

    it('should throw error when email sending fails', async () => {
      const createEmailDto = {
        to: 'user@example.com',
        subject: 'Test',
        text: 'Test',
        body: '<p>Test</p>',
      };

      mockMailerService.sendMail.mockRejectedValue(new Error('SMTP connection failed'));

      await expect(service.create(createEmailDto)).rejects.toThrow('Error sending email');
    });

    it('should use SMTP_FROM environment variable', async () => {
      const createEmailDto = {
        to: 'user@example.com',
        subject: 'Test',
        text: 'Test',
        body: '<p>Test</p>',
      };

      mockMailerService.sendMail.mockResolvedValue({ messageId: 'msg-123' });

      await service.create(createEmailDto);

      expect(mockMailerService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: process.env.SMTP_FROM,
        })
      );
    });

    it('should be triggered for critical situations', async () => {
      const criticalAlertEmail = {
        to: 'ops-team@example.com',
        subject: 'Critical Alert: Service API - Z-Score 10.5',
        text: 'Anomaly detected with severity CRITICAL',
        body: '<div><h1>CRITICAL ALERT</h1><p>Immediate attention required</p></div>',
      };

      mockMailerService.sendMail.mockResolvedValue({ messageId: 'critical-123' });

      const result = await service.create(criticalAlertEmail);

      expect(result).toBeDefined();
      expect(mockMailerService.sendMail).toHaveBeenCalled();
    });
  });
});
