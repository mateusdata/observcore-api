import { Test, TestingModule } from '@nestjs/testing';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';

describe('AlertsController', () => {
  let controller: AlertsController;
  let alertsService: AlertsService;

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

  const mockAlertsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlertsController],
      providers: [
        {
          provide: AlertsService,
          useValue: mockAlertsService,
        },
      ],
    }).compile();

    controller = module.get<AlertsController>(AlertsController);
    alertsService = module.get<AlertsService>(AlertsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create alert with severity enum', async () => {
      const createDto = {
        metricId: 'metric-uuid-123',
        value: 5.0,
        zScoreValue: 5.0,
        severity: 'HIGH' as const,
      };

      mockAlertsService.create.mockResolvedValue({
        ...mockAlert,
        ...createDto,
      });

      const result = await controller.create(createDto);

      expect(result.severity).toBe('HIGH');
      expect(mockAlertsService.create).toHaveBeenCalledWith(createDto);
    });

    it('should accept all severity levels', async () => {
      const severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;

      for (const severity of severities) {
        const createDto = {
          metricId: 'metric-uuid-123',
          value: 3.0,
          zScoreValue: 3.0,
          severity,
        };

        mockAlertsService.create.mockResolvedValue({
          ...mockAlert,
          severity,
        });

        const result = await controller.create(createDto);
        expect(result.severity).toBe(severity);
      }
    });
  });

  describe('findAll', () => {
    it('should return all alerts', async () => {
      mockAlertsService.findAll.mockResolvedValue([mockAlert]);

      const result = await controller.findAll();

      expect(result).toHaveLength(1);
      expect(mockAlertsService.findAll).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update alert', async () => {
      const updateDto = { isResolved: true };

      mockAlertsService.update.mockResolvedValue({
        ...mockAlert,
        isResolved: true,
      });

      const result = await controller.update('alert-uuid-123', updateDto);

      expect(result.isResolved).toBe(true);
      expect(mockAlertsService.update).toHaveBeenCalledWith('alert-uuid-123', updateDto);
    });
  });
});
