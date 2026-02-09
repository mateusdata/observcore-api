import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { EmailsService } from '../emails/emails.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let emailService: EmailsService;

  const mockUser = {
    id: 'user-uuid-123',
    email: 'test@example.com',
    password: '$2b$10$hashedpassword',
    name: 'Test User',
    verificationCode: null,
    verificationExpiry: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
    verify: jest.fn(),
    decode: jest.fn().mockReturnValue({ payload: { exp: 1234567890 } }),
  };

  const mockEmailsService = {
    create: jest.fn().mockResolvedValue({ success: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: EmailsService,
          useValue: mockEmailsService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    emailService = module.get<EmailsService>(EmailsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create (login)', () => {
    it('should authenticate user with valid credentials and return JWT token', async () => {
      const hashedPassword = await bcrypt.hash('validpassword', 10);
      const userWithPassword = { ...mockUser, password: hashedPassword };

      mockPrismaService.user.findUnique.mockResolvedValue(userWithPassword);

      const result = await service.create({
        email: 'test@example.com',
        password: 'validpassword',
      });

      expect(result).toHaveProperty('token');
      expect(result.token).toBe('mock-jwt-token');
      expect(result.email).toBe('test@example.com');
      expect(result).not.toHaveProperty('password');
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: userWithPassword.id,
        email: userWithPassword.email,
      });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.create({ email: 'nonexistent@example.com', password: '123456' })
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });

      await expect(
        service.create({ email: 'test@example.com', password: 'wrongpassword' })
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should normalize email to lowercase', async () => {
      const hashedPassword = await bcrypt.hash('validpassword', 10);
      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });

      await service.create({
        email: '  TEST@EXAMPLE.COM  ',
        password: 'validpassword',
      });

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        omit: { password: false },
      });
    });
  });

  describe('refreshToken', () => {
    it('should return new token for valid refresh token', async () => {
      mockJwtService.verify.mockReturnValue({ sub: mockUser.id });
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.refreshToken('valid-refresh-token');

      expect(result).toHaveProperty('token');
      expect(result.token).toBe('mock-jwt-token');
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshToken('invalid-token')).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw NotFoundException when user from token does not exist', async () => {
      mockJwtService.verify.mockReturnValue({ sub: 'nonexistent-id' });
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.refreshToken('valid-token')).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe('sendEmailCode', () => {
    it('should send verification code to user email', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const result = await service.sendEmailCode('test@example.com');

      expect(result).toHaveProperty('message');
      expect(result.email).toBe(mockUser.email);
      expect(mockEmailsService.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.sendEmailCode('nonexistent@example.com')
      ).rejects.toThrow(NotFoundException);
    });
  });
});
