import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PrismaErrorHandler } from 'src/common/exceptions/prisma-error-handler';

@Injectable()
export class ServicesService {
  constructor(private prismaService: PrismaService) { }

  async create(createDto: CreateServiceDto) {
    try {
      return await this.prismaService.service.create({
        data: createDto,
      });
    } catch (error) {
      PrismaErrorHandler.handle(error);
    }
  }

  async findAll(userId: string) {
    try {
      return await this.prismaService.service.findMany({
        where: {
          prometheusConfig: {
            userId: userId
          }
        },
        include: { metrics: true }
      });
    } catch (error) {
      PrismaErrorHandler.handle(error);
    }
  }

  async findOne(id: string) {
    try {
      const service = await this.prismaService.service.findUnique({
        where: { id },
        include: { metrics: true }
      });
      if (!service) throw new NotFoundException('Service not found');
      return service;
    } catch (error) {
      PrismaErrorHandler.handle(error);
    }
  }

  async update(id: string, updateDto: UpdateServiceDto) {
    try {
      return await this.prismaService.service.update({
        where: { id },
        data: updateDto,
      });
    } catch (error) {
      PrismaErrorHandler.handle(error);
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.service.delete({
        where: { id },
      });
    } catch (error) {
      PrismaErrorHandler.handle(error);
    }
  }
}