import { Test, TestingModule } from '@nestjs/testing';
import { PrometheusConfigsService } from './prometheus-configs.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('PrometheusConfigsService', () => {
  let service: PrometheusConfigsService;
  let prisma: PrismaService;

  const mockConfig = {
    id: 'config-uuid-123',
    url: 'http://prometheus:9090',
    name: 'Main Prometheus',
    userId: 'user-uuid-123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    prometheusConfig: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrometheusConfigsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PrometheusConfigsService>(PrometheusConfigsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create config linked to authenticated user (1:1 relation)', async () => {
      const userId = 'user-uuid-123';
      const createDto = {
        url: 'http://prometheus:9090',
        name: 'Main Prometheus',
      };

      mockPrismaService.prometheusConfig.create.mockResolvedValue({
        ...mockConfig,
        ...createDto,
        userId,
      });

      const result = await service.create(userId, createDto);

      expect(result.userId).toBe(userId);
      expect(result.url).toBe(createDto.url);
      expect(mockPrismaService.prometheusConfig.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          userId,
        },
      });
    });

    it('should enforce unique userId constraint (1:1)', async () => {
      const userId = 'user-uuid-123';
      const createDto = {
        url: 'http://prometheus:9090',
        name: 'Duplicate Config',
      };

      const prismaError = {
        code: 'P2002',
        meta: { target: ['userId'] },
      };

      mockPrismaService.prometheusConfig.create.mockRejectedValue(prismaError);

      await expect(service.create(userId, createDto)).rejects.toBeDefined();
    });
  });

  describe('findOne', () => {
    it('should find config by userId', async () => {
      mockPrismaService.prometheusConfig.findUnique.mockResolvedValue({
        ...mockConfig,
        services: [],
      });

      const result = await service.findOne('user-uuid-123');

      expect(result.userId).toBe('user-uuid-123');
      expect(mockPrismaService.prometheusConfig.findUnique).toHaveBeenCalledWith({
        where: { userId: 'user-uuid-123' },
        include: { services: true },
      });
    });

    it('should throw NotFoundException when config does not exist', async () => {
      mockPrismaService.prometheusConfig.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-user')).rejects.toThrow(NotFoundException);
    });

    it('should include services relation', async () => {
      mockPrismaService.prometheusConfig.findUnique.mockResolvedValue({
        ...mockConfig,
        services: [{ id: 'service-1', name: 'API Service' }],
      });

      const result = await service.findOne('user-uuid-123');

      expect(result.services).toBeDefined();
      expect(result.services).toHaveLength(1);
    });
  });

  describe('update', () => {
    it('should update config by userId', async () => {
      const updateDto = { url: 'http://new-prometheus:9090' };

      mockPrismaService.prometheusConfig.update.mockResolvedValue({
        ...mockConfig,
        ...updateDto,
      });

      const result = await service.update('user-uuid-123', updateDto);

      expect(result.url).toBe('http://new-prometheus:9090');
      expect(mockPrismaService.prometheusConfig.update).toHaveBeenCalledWith({
        where: { userId: 'user-uuid-123' },
        data: updateDto,
      });
    });
  });

  describe('remove', () => {
    it('should delete config by userId', async () => {
      mockPrismaService.prometheusConfig.delete.mockResolvedValue(mockConfig);

      await service.remove('user-uuid-123');

      expect(mockPrismaService.prometheusConfig.delete).toHaveBeenCalledWith({
        where: { userId: 'user-uuid-123' },
      });
    });
  });
});
