import { Test, TestingModule } from '@nestjs/testing';
import { MetricsService } from './metrics.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AlertsService } from '../alerts/alerts.service';

describe('MetricsService', () => {
  let service: MetricsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    metric: {
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
        MetricsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        AlertsService
      ],
    }).compile();

    service = module.get<MetricsService>(MetricsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have prisma service', () => {
    expect(prisma).toBeDefined();
  });
});
