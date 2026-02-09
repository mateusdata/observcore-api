import { Test, TestingModule } from '@nestjs/testing';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';

describe('MetricsController', () => {
  let controller: MetricsController;
  let metricsService: MetricsService;

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

  const mockMetricsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricsController],
      providers: [
        {
          provide: MetricsService,
          useValue: mockMetricsService,
        },
      ],
    }).compile();

    controller = module.get<MetricsController>(MetricsController);
    metricsService = module.get<MetricsService>(MetricsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a metric with promQL and thresholds', async () => {
      const createDto = {
        name: 'CPU Usage',
        promQL: 'node_cpu_seconds_total',
        zScoreThreshold: 2.5,
        checkInterval: 30,
        serviceId: 'service-uuid-123',
      };

      mockMetricsService.create.mockResolvedValue({
        ...mockMetric,
        ...createDto,
      });

      const result = await controller.create(createDto);

      expect(result.promQL).toBe('node_cpu_seconds_total');
      expect(result.zScoreThreshold).toBe(2.5);
      expect(mockMetricsService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return all metrics', async () => {
      mockMetricsService.findAll.mockResolvedValue([mockMetric]);

      const result = await controller.findAll();

      expect(result).toHaveLength(1);
      expect(mockMetricsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a metric by id', async () => {
      mockMetricsService.findOne.mockResolvedValue(mockMetric);

      const result = await controller.findOne('metric-uuid-123');

      expect(result.id).toBe('metric-uuid-123');
      expect(mockMetricsService.findOne).toHaveBeenCalledWith('metric-uuid-123');
    });
  });

  describe('update', () => {
    it('should update a metric', async () => {
      const updateDto = { zScoreThreshold: 4.0 };

      mockMetricsService.update.mockResolvedValue({
        ...mockMetric,
        zScoreThreshold: 4.0,
      });

      const result = await controller.update('metric-uuid-123', updateDto);

      expect(result.zScoreThreshold).toBe(4.0);
      expect(mockMetricsService.update).toHaveBeenCalledWith('metric-uuid-123', updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a metric', async () => {
      mockMetricsService.remove.mockResolvedValue(undefined);

      await controller.remove('metric-uuid-123');

      expect(mockMetricsService.remove).toHaveBeenCalledWith('metric-uuid-123');
    });
  });
});
