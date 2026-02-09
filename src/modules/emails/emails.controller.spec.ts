import { Test, TestingModule } from '@nestjs/testing';
import { EmailsController } from './emails.controller';
import { EmailsService } from './emails.service';

describe('EmailsController', () => {
  let controller: EmailsController;
  let emailsService: EmailsService;

  const mockEmailsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailsController],
      providers: [
        {
          provide: EmailsService,
          useValue: mockEmailsService,
        },
      ],
    }).compile();

    controller = module.get<EmailsController>(EmailsController);
    emailsService = module.get<EmailsService>(EmailsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create and send email', async () => {
      const createEmailDto = {
        to: 'user@example.com',
        subject: 'Test Subject',
        text: 'Test content',
        body: '<p>HTML content</p>',
      };

      mockEmailsService.create.mockResolvedValue({ messageId: 'msg-123' });

      const result = await controller.create(createEmailDto);

      expect(result).toHaveProperty('messageId');
      expect(mockEmailsService.create).toHaveBeenCalledWith(createEmailDto);
    });
  });

  describe('findAll', () => {
    it('should return all emails', async () => {
      mockEmailsService.findAll.mockResolvedValue('This action returns all emails');

      const result = await controller.findAll();

      expect(mockEmailsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return email by id', async () => {
      mockEmailsService.findOne.mockResolvedValue('This action returns a #1 email');

      const result = await controller.findOne('1');

      expect(mockEmailsService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update email by id', async () => {
      const updateDto = { subject: 'Updated Subject' };

      mockEmailsService.update.mockResolvedValue('This action updates a #1 email');

      const result = await controller.update('1', updateDto);

      expect(mockEmailsService.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove email by id', async () => {
      mockEmailsService.remove.mockResolvedValue('This action removes a #1 email');

      const result = await controller.remove('1');

      expect(mockEmailsService.remove).toHaveBeenCalledWith(1);
    });
  });
});
