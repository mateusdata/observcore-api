import { Test, TestingModule } from '@nestjs/testing';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

describe('ServicesController', () => {
  let controller: ServicesController;
  let servicesService: ServicesService;

  const mockService = {
    id: 'service-uuid-123',
    name: 'API Service',
    description: 'Main API service',
    prometheusConfigId: 'config-uuid-123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockServicesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesController],
      providers: [
        {
          provide: ServicesService,
          useValue: mockServicesService,
        },
      ],
    }).compile();

    controller = module.get<ServicesController>(ServicesController);
    servicesService = module.get<ServicesService>(ServicesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new service', async () => {
      const createDto = {
        name: 'API Service',
        prometheusConfigId: 'config-uuid-123',
      };

      mockServicesService.create.mockResolvedValue(mockService);

      const result = await controller.create(createDto);

      expect(result.name).toBe('API Service');
      expect(mockServicesService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return all services', async () => {
      mockServicesService.findAll.mockResolvedValue([mockService]);

      const result = await controller.findAll();

      expect(result).toHaveLength(1);
      expect(mockServicesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a service by id', async () => {
      mockServicesService.findOne.mockResolvedValue(mockService);

      const result = await controller.findOne('service-uuid-123');

      expect(result.id).toBe('service-uuid-123');
      expect(mockServicesService.findOne).toHaveBeenCalledWith('service-uuid-123');
    });
  });

  describe('update', () => {
    it('should update a service', async () => {
      const updateDto = { name: 'Updated Service' };

      mockServicesService.update.mockResolvedValue({
        ...mockService,
        name: 'Updated Service',
      });

      const result = await controller.update('service-uuid-123', updateDto);

      expect(result.name).toBe('Updated Service');
      expect(mockServicesService.update).toHaveBeenCalledWith('service-uuid-123', updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a service', async () => {
      mockServicesService.remove.mockResolvedValue(undefined);

      await controller.remove('service-uuid-123');

      expect(mockServicesService.remove).toHaveBeenCalledWith('service-uuid-123');
    });
  });
});
