import { Test, TestingModule } from '@nestjs/testing';
import { PrometheusConfigsController } from './prometheus-configs.controller';
import { PrometheusConfigsService } from './prometheus-configs.service';

describe('PrometheusConfigsController', () => {
  let controller: PrometheusConfigsController;
  let service: PrometheusConfigsService;

  const mockConfig = {
    id: 'config-uuid-123',
    url: 'http://prometheus:9090',
    name: 'Main Prometheus',
    userId: 'user-uuid-123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrometheusConfigsService = {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrometheusConfigsController],
      providers: [
        {
          provide: PrometheusConfigsService,
          useValue: mockPrometheusConfigsService,
        },
      ],
    }).compile();

    controller = module.get<PrometheusConfigsController>(PrometheusConfigsController);
    service = module.get<PrometheusConfigsService>(PrometheusConfigsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create config for authenticated user', async () => {
      const userId = 'user-uuid-123';
      const createDto = {
        url: 'http://prometheus:9090',
        name: 'Main Prometheus',
      };

      mockPrometheusConfigsService.create.mockResolvedValue({
        ...mockConfig,
        userId,
      });

      const result = await controller.create(userId, createDto);

      expect(result.userId).toBe(userId);
      expect(mockPrometheusConfigsService.create).toHaveBeenCalledWith(userId, createDto);
    });
  });

  describe('findOne', () => {
    it('should return config for authenticated user', async () => {
      const userId = 'user-uuid-123';

      mockPrometheusConfigsService.findOne.mockResolvedValue(mockConfig);

      const result = await controller.findOne(userId);

      expect(result.userId).toBe(userId);
      expect(mockPrometheusConfigsService.findOne).toHaveBeenCalledWith(userId);
    });
  });

  describe('update', () => {
    it('should update config for authenticated user', async () => {
      const userId = 'user-uuid-123';
      const updateDto = { url: 'http://new-prometheus:9090' };

      mockPrometheusConfigsService.update.mockResolvedValue({
        ...mockConfig,
        ...updateDto,
      });

      const result = await controller.update(userId, updateDto);

      expect(result.url).toBe('http://new-prometheus:9090');
      expect(mockPrometheusConfigsService.update).toHaveBeenCalledWith(userId, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove config for authenticated user', async () => {
      const userId = 'user-uuid-123';

      mockPrometheusConfigsService.remove.mockResolvedValue(undefined);

      await controller.remove(userId);

      expect(mockPrometheusConfigsService.remove).toHaveBeenCalledWith(userId);
    });
  });
});
