import { Injectable } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PrismaErrorHandler } from 'src/common/exceptions/prisma-error-handler';

@Injectable()
export class AlertsService {
  constructor(private prismaService: PrismaService) {}

  async create(createDto: CreateAlertDto) {
    try {
      return await this.prismaService.alert.create({
        data: createDto,
      });
    } catch (error) {
      PrismaErrorHandler.handle(error);
    }
  }

  async findAll() {
    try {
      return await this.prismaService.alert.findMany({
        orderBy: { timestamp: 'desc' },
        include: { 
            metric: {
                include: { service: true }
            } 
        }
      });
    } catch (error) {
      PrismaErrorHandler.handle(error);
    }
  }

  async update(id: string, updateDto: UpdateAlertDto) {
    try {
      return await this.prismaService.alert.update({
        where: { id },
        data: updateDto,
      });
    } catch (error) {
      PrismaErrorHandler.handle(error);
    }
  }
}