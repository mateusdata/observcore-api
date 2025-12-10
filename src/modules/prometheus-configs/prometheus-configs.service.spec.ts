import { Test, TestingModule } from '@nestjs/testing';
import { PrometheusConfigsService } from './prometheus-configs.service';
import { PrismaService } from 'src/common/prisma/prisma.service';

describe('PrometheusConfigsService', () => {
  let service: PrometheusConfigsService;
  let prisma: PrismaService;

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

  it('should have prisma service', () => {
    expect(prisma).toBeDefined();
  });
});
