import { Test, TestingModule } from '@nestjs/testing';
import { PrometheusConfigsController } from './prometheus-configs.controller';
import { PrometheusConfigsService } from './prometheus-configs.service';
import { PrismaService } from 'src/common/prisma/prisma.service';

describe('PrometheusConfigsController', () => {
  let controller: PrometheusConfigsController;

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
      controllers: [PrometheusConfigsController],
      providers: [
        PrometheusConfigsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    controller = module.get<PrometheusConfigsController>(PrometheusConfigsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
