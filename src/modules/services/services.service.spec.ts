import { Test, TestingModule } from '@nestjs/testing';
import { ServicesService } from './services.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ServicesService', () => {
  let service: ServicesService;
  let prisma: PrismaService;

  const mockService = {
    id: 'service-uuid-123',
    name: 'API Service',
    description: 'Main API service',
    prometheusConfigId: 'config-uuid-123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    service: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    prometheusConfig: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create service with valid prometheusConfigId', async () => {
      const createDto = {
        name: 'API Service',
        description: 'Main API',
        prometheusConfigId: 'config-uuid-123',
      };

      mockPrismaService.service.create.mockResolvedValue({
        ...mockService,
        ...createDto,
      });

      const result = await service.create(createDto);

      expect(result.name).toBe('API Service');
      expect(result.prometheusConfigId).toBe('config-uuid-123');
      expect(mockPrismaService.service.create).toHaveBeenCalledWith({
        data: createDto,
      });
    });

    it('should fail when prometheusConfigId does not exist', async () => {
      const createDto = {
        name: 'API Service',
        prometheusConfigId: 'invalid-config-id',
      };

      const prismaError = {
        code: 'P2003',
        meta: { field_name: 'prometheusConfigId' },
      };

      mockPrismaService.service.create.mockRejectedValue(prismaError);

      await expect(service.create(createDto)).rejects.toBeDefined();
    });

    it('should require prometheusConfigId field', async () => {
      const createDto = {
        name: 'API Service',
        prometheusConfigId: 'config-uuid-123',
      };

      mockPrismaService.service.create.mockResolvedValue(mockService);

      await service.create(createDto);

      expect(mockPrismaService.service.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          prometheusConfigId: 'config-uuid-123',
        }),
      });
    });
  });

  describe('findAll', () => {
    it('should return all services with metrics', async () => {
      mockPrismaService.service.findMany.mockResolvedValue([
        { ...mockService, metrics: [] },
        { ...mockService, id: 'service-2', name: 'Worker Service', metrics: [] },
      ]);

      const result = await service.findAll('user-id');

      expect(result).toHaveLength(2);
      expect(mockPrismaService.service.findMany).toHaveBeenCalledWith({
        where: { prometheusConfig: { userId: 'user-id' } },
        include: { metrics: true },
      });
    });
  });

  describe('findOne', () => {
    it('should return service with metrics', async () => {
      mockPrismaService.service.findUnique.mockResolvedValue({
        ...mockService,
        metrics: [{ id: 'metric-1', name: 'CPU Usage' }],
      });

      const result = await service.findOne('service-uuid-123');

      expect(result.id).toBe('service-uuid-123');
      expect(result.metrics).toHaveLength(1);
    });

    it('should throw NotFoundException when service does not exist', async () => {
      mockPrismaService.service.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update service successfully', async () => {
      const updateDto = { name: 'Updated Service' };

      mockPrismaService.service.update.mockResolvedValue({
        ...mockService,
        name: 'Updated Service',
      });

      const result = await service.update('service-uuid-123', updateDto);

      expect(result.name).toBe('Updated Service');
    });
  });

  describe('remove', () => {
    it('should delete service successfully', async () => {
      mockPrismaService.service.delete.mockResolvedValue(mockService);

      await service.remove('service-uuid-123');

      expect(mockPrismaService.service.delete).toHaveBeenCalledWith({
        where: { id: 'service-uuid-123' },
      });
    });
  });
});
