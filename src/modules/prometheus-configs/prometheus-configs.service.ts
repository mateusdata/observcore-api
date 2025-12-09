import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePrometheusConfigDto } from './dto/create-prometheus-config.dto';
import { UpdatePrometheusConfigDto } from './dto/update-prometheus-config.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PrismaErrorHandler } from 'src/common/exceptions/prisma-error-handler';

@Injectable()
export class PrometheusConfigsService {
  constructor(private prismaService: PrismaService) {}

  async create(userId: string, createDto: CreatePrometheusConfigDto) {
    try {
      return await this.prismaService.prometheusConfig.create({
        data: {
          ...createDto,
          userId,
        },
      });
    } catch (error) {
      PrismaErrorHandler.handle(error);
    }
  }

  async findOne(userId: string) {
    try {
      const config = await this.prismaService.prometheusConfig.findUnique({
        where: { userId },
        include: {
            services: true
        }
      });
      if (!config) throw new NotFoundException('Config not found');
      return config;
    } catch (error) {
      PrismaErrorHandler.handle(error);
    }
  }

  async update(userId: string, updateDto: UpdatePrometheusConfigDto) {
    try {
      return await this.prismaService.prometheusConfig.update({
        where: { userId },
        data: updateDto,
      });
    } catch (error) {
      PrismaErrorHandler.handle(error);
    }
  }

  async remove(userId: string) {
    try {
      await this.prismaService.prometheusConfig.delete({
        where: { userId },
      });
    } catch (error) {
      PrismaErrorHandler.handle(error);
    }
  }
}