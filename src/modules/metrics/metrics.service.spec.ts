import { Test, TestingModule } from '@nestjs/testing';
import { MetricsService } from './metrics.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AlertsService } from '../alerts/alerts.service';
import { NotFoundException } from '@nestjs/common';

describe('MetricsService', () => {
  let service: MetricsService;
  let prisma: PrismaService;
  let alertsService: AlertsService;

  const mockMetric = {
    id: 'metric-uuid-123',
    name: 'CPU Usage',
    promQL: 'node_cpu_seconds_total',
    zScoreThreshold: 3.0,
    checkInterval: 60,
    serviceId: 'service-uuid-123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    metric: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockAlertsService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: AlertsService,
          useValue: mockAlertsService,
        },
      ],
    }).compile();

    service = module.get<MetricsService>(MetricsService);
    prisma = module.get<PrismaService>(PrismaService);
    alertsService = module.get<AlertsService>(AlertsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create metric with promQL, zScoreThreshold and checkInterval', async () => {
      const createDto = {
        name: 'CPU Usage',
        promQL: 'node_cpu_seconds_total',
        zScoreThreshold: 2.5,
        checkInterval: 30,
        serviceId: 'service-uuid-123',
      };

      mockPrismaService.metric.create.mockResolvedValue({
        ...mockMetric,
        ...createDto,
      });

      const result = await service.create(createDto);

      expect(result.promQL).toBe('node_cpu_seconds_total');
      expect(result.zScoreThreshold).toBe(2.5);
      expect(result.checkInterval).toBe(30);
      expect(result.serviceId).toBe('service-uuid-123');
    });

    it('should create metric linked to existing service', async () => {
      const createDto = {
        name: 'Memory Usage',
        promQL: 'node_memory_MemTotal_bytes',
        serviceId: 'service-uuid-123',
      };

      mockPrismaService.metric.create.mockResolvedValue({
        ...mockMetric,
        ...createDto,
      });

      const result = await service.create(createDto);

      expect(result.serviceId).toBe('service-uuid-123');
      expect(mockPrismaService.metric.create).toHaveBeenCalledWith({
        data: createDto,
      });
    });

    it('should fail when serviceId does not exist', async () => {
      const createDto = {
        name: 'CPU Usage',
        promQL: 'node_cpu_seconds_total',
        serviceId: 'invalid-service-id',
      };

      const prismaError = {
        code: 'P2003',
        meta: { field_name: 'serviceId' },
      };

      mockPrismaService.metric.create.mockRejectedValue(prismaError);

      await expect(service.create(createDto)).rejects.toBeDefined();
    });

    it('should use default values for optional fields', async () => {
      const createDto = {
        name: 'CPU Usage',
        promQL: 'node_cpu_seconds_total',
        serviceId: 'service-uuid-123',
      };

      mockPrismaService.metric.create.mockResolvedValue({
        ...mockMetric,
        zScoreThreshold: 3.0,
        checkInterval: 60,
      });

      const result = await service.create(createDto);

      expect(result.zScoreThreshold).toBe(3.0);
      expect(result.checkInterval).toBe(60);
    });
  });

  describe('findAll', () => {
    it('should return all metrics', async () => {
      mockPrismaService.metric.findMany.mockResolvedValue([mockMetric]);

      const result = await service.findAll('user-id');

      expect(result).toHaveLength(1);
      expect(mockPrismaService.metric.findMany).toHaveBeenCalledWith({
        where: { service: { prometheusConfig: { userId: 'user-id' } } }
      });
    });
  });

  describe('findOne', () => {
    it('should return metric with alerts', async () => {
      mockPrismaService.metric.findUnique.mockResolvedValue({
        ...mockMetric,
        alerts: [{ id: 'alert-1', severity: 'HIGH' }],
      });

      const result = await service.findOne('metric-uuid-123');

      expect(result.id).toBe('metric-uuid-123');
      expect(result.alerts).toHaveLength(1);
    });

    it('should throw NotFoundException when metric does not exist', async () => {
      mockPrismaService.metric.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update metric successfully', async () => {
      const updateDto = { zScoreThreshold: 4.0 };

      mockPrismaService.metric.update.mockResolvedValue({
        ...mockMetric,
        zScoreThreshold: 4.0,
      });

      const result = await service.update('metric-uuid-123', updateDto);

      expect(result.zScoreThreshold).toBe(4.0);
    });
  });

  describe('remove', () => {
    it('should delete metric successfully', async () => {
      mockPrismaService.metric.delete.mockResolvedValue(mockMetric);

      await service.remove('metric-uuid-123');

      expect(mockPrismaService.metric.delete).toHaveBeenCalledWith({
        where: { id: 'metric-uuid-123' },
      });
    });
  });
});
