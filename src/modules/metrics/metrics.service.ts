import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMetricDto } from './dto/create-metric.dto';
import { UpdateMetricDto } from './dto/update-metric.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PrismaErrorHandler } from 'src/common/exceptions/prisma-error-handler';

@Injectable()
export class MetricsService {
  constructor(private prismaService: PrismaService) {}

  async create(createDto: CreateMetricDto) {
    try {
      return await this.prismaService.metric.create({
        data: createDto,
      });
    } catch (error) {
      PrismaErrorHandler.handle(error);
    }
  }

  async findAll() {
    try {
      return await this.prismaService.metric.findMany();
    } catch (error) {
      PrismaErrorHandler.handle(error);
    }
  }

  async findOne(id: string) {
    try {
      const metric = await this.prismaService.metric.findUnique({
        where: { id },
        include: { alerts: true }
      });
      if (!metric) throw new NotFoundException('Metric not found');
      return metric;
    } catch (error) {
      PrismaErrorHandler.handle(error);
    }
  }

  async update(id: string, updateDto: UpdateMetricDto) {
    try {
      return await this.prismaService.metric.update({
        where: { id },
        data: updateDto,
      });
    } catch (error) {
      PrismaErrorHandler.handle(error);
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.metric.delete({
        where: { id },
      });
    } catch (error) {
      PrismaErrorHandler.handle(error);
    }
  }
}