import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { EmailsService } from '../emails/emails.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockUser = {
    id: 'user-uuid-123',
    email: 'test@example.com',
    password: 'hashedpassword',
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockEmailsService = {
    create: jest.fn().mockResolvedValue({ success: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: EmailsService,
          useValue: mockEmailsService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createUserDto = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
      };

      mockPrismaService.user.create.mockResolvedValue({
        ...mockUser,
        ...createUserDto,
        password: 'hashedpassword',
      });

      const result = await service.create(createUserDto);

      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe('newuser@example.com');
      expect(mockPrismaService.user.create).toHaveBeenCalled();
    });

    it('should normalize email to lowercase', async () => {
      const createUserDto = {
        email: '  TEST@EXAMPLE.COM  ',
        password: 'password123',
        name: 'Test',
      };

      mockPrismaService.user.create.mockResolvedValue({
        ...mockUser,
        email: 'test@example.com',
      });

      await service.create(createUserDto);

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'test@example.com',
        }),
      });
    });

    it('should throw 409 Conflict when email already exists', async () => {
      const createUserDto = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User',
      };

      const prismaError = {
        code: 'P2002',
        clientVersion: '5.0.0',
        meta: { target: ['email'] },
      };

      mockPrismaService.user.create.mockRejectedValue(prismaError);

      await expect(service.create(createUserDto)).rejects.toMatchObject({
        code: 'P2002',
      });
    });

    it('should send welcome email after creating user', async () => {
      const createUserDto = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
      };

      mockPrismaService.user.create.mockResolvedValue({
        ...mockUser,
        ...createUserDto,
      });

      await service.create(createUserDto);

      expect(mockEmailsService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'newuser@example.com',
          subject: expect.stringContaining('ObservCore'),
        })
      );
    });
  });

  describe('findOne', () => {
    it('should return user without password', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne('user-uuid-123');

      expect(result).not.toHaveProperty('password');
      expect(result.id).toBe('user-uuid-123');
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(NotFoundException);
    });

    it('should include config relation', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        config: { id: 'config-id', url: 'http://prometheus:9090' },
      });

      const result = await service.findOne('user-uuid-123');

      expect(result.config).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const updateUserDto = { name: 'Updated Name' };

      mockPrismaService.user.update.mockResolvedValue({
        ...mockUser,
        name: 'Updated Name',
      });

      const result = await service.update('user-uuid-123', updateUserDto);

      expect(result.name).toBe('Updated Name');
      expect(result).not.toHaveProperty('password');
    });

    it('should hash password when updating', async () => {
      const updateUserDto = { password: 'newpassword' };

      mockPrismaService.user.update.mockResolvedValue(mockUser);

      await service.update('user-uuid-123', updateUserDto);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-uuid-123' },
        data: expect.objectContaining({
          password: expect.not.stringMatching('newpassword'),
        }),
      });
    });
  });

  describe('remove', () => {
    it('should delete user successfully', async () => {
      mockPrismaService.user.delete.mockResolvedValue(mockUser);

      await service.remove('user-uuid-123');

      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: 'user-uuid-123' },
      });
    });
  });
});
