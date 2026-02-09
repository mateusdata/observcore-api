import { Test, TestingModule } from '@nestjs/testing';
import { AlertsService } from './alerts.service';
import { PrismaService } from 'src/common/prisma/prisma.service';

describe('AlertsService', () => {
  let service: AlertsService;
  let prisma: PrismaService;

  const mockAlert = {
    id: 'alert-uuid-123',
    metricId: 'metric-uuid-123',
    value: 5.2,
    zScoreValue: 5.2,
    severity: 'HIGH',
    isResolved: false,
    timestamp: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    alert: {
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
        AlertsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AlertsService>(AlertsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create alert with severity LOW', async () => {
      const createDto = {
        metricId: 'metric-uuid-123',
        value: 1.5,
        zScoreValue: 1.5,
        severity: 'LOW' as const,
      };

      mockPrismaService.alert.create.mockResolvedValue({
        ...mockAlert,
        ...createDto,
        severity: 'LOW',
      });

      const result = await service.create(createDto);

      expect(result.severity).toBe('LOW');
      expect(mockPrismaService.alert.create).toHaveBeenCalledWith({
        data: createDto,
      });
    });

    it('should create alert with severity MEDIUM', async () => {
      const createDto = {
        metricId: 'metric-uuid-123',
        value: 2.5,
        zScoreValue: 2.5,
        severity: 'MEDIUM' as const,
      };

      mockPrismaService.alert.create.mockResolvedValue({
        ...mockAlert,
        ...createDto,
        severity: 'MEDIUM',
      });

      const result = await service.create(createDto);

      expect(result.severity).toBe('MEDIUM');
    });

    it('should create alert with severity HIGH', async () => {
      const createDto = {
        metricId: 'metric-uuid-123',
        value: 4.0,
        zScoreValue: 4.0,
        severity: 'HIGH' as const,
      };

      mockPrismaService.alert.create.mockResolvedValue({
        ...mockAlert,
        ...createDto,
        severity: 'HIGH',
      });

      const result = await service.create(createDto);

      expect(result.severity).toBe('HIGH');
    });

    it('should create alert with severity CRITICAL', async () => {
      const createDto = {
        metricId: 'metric-uuid-123',
        value: 8.0,
        zScoreValue: 8.0,
        severity: 'CRITICAL' as const,
      };

      mockPrismaService.alert.create.mockResolvedValue({
        ...mockAlert,
        ...createDto,
        severity: 'CRITICAL',
      });

      const result = await service.create(createDto);

      expect(result.severity).toBe('CRITICAL');
    });

    it('should link alert to metricId', async () => {
      const createDto = {
        metricId: 'metric-uuid-123',
        value: 5.0,
        zScoreValue: 5.0,
        severity: 'HIGH' as const,
      };

      mockPrismaService.alert.create.mockResolvedValue({
        ...mockAlert,
        ...createDto,
      });

      const result = await service.create(createDto);

      expect(result.metricId).toBe('metric-uuid-123');
    });
  });

  describe('findAll', () => {
    it('should return alerts ordered by timestamp desc', async () => {
      const alerts = [
        { ...mockAlert, id: 'alert-1', timestamp: new Date('2024-01-02') },
        { ...mockAlert, id: 'alert-2', timestamp: new Date('2024-01-01') },
      ];

      mockPrismaService.alert.findMany.mockResolvedValue(alerts);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(mockPrismaService.alert.findMany).toHaveBeenCalledWith({
        orderBy: { timestamp: 'desc' },
        include: {
          metric: {
            include: { service: true },
          },
        },
      });
    });

    it('should include metric and service relations', async () => {
      mockPrismaService.alert.findMany.mockResolvedValue([
        {
          ...mockAlert,
          metric: {
            id: 'metric-1',
            name: 'CPU Usage',
            service: { id: 'service-1', name: 'API Service' },
          },
        },
      ]);

      const result = await service.findAll();

      expect(result[0].metric).toBeDefined();
      expect(result[0].metric.service).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update isResolved status', async () => {
      const updateDto = { isResolved: true };

      mockPrismaService.alert.update.mockResolvedValue({
        ...mockAlert,
        isResolved: true,
      });

      const result = await service.update('alert-uuid-123', updateDto);

      expect(result.isResolved).toBe(true);
      expect(mockPrismaService.alert.update).toHaveBeenCalledWith({
        where: { id: 'alert-uuid-123' },
        data: updateDto,
      });
    });

    it('should mark alert as unresolved', async () => {
      const updateDto = { isResolved: false };

      mockPrismaService.alert.update.mockResolvedValue({
        ...mockAlert,
        isResolved: false,
      });

      const result = await service.update('alert-uuid-123', updateDto);

      expect(result.isResolved).toBe(false);
    });
  });
});
