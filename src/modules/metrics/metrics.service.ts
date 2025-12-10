import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CreateMetricDto } from './dto/create-metric.dto';
import { UpdateMetricDto } from './dto/update-metric.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PrismaErrorHandler } from 'src/common/exceptions/prisma-error-handler';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AlertsService } from '../alerts/alerts.service';

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  constructor(
    private prismaService: PrismaService,
    private alertsService: AlertsService,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleCron() {
    
   try {
     const metrics = await this.prismaService.metric.findMany({
      include: {
        service: {
          include: {
            prometheusConfig: true,
          },
        },
      },
    });
    if (!metrics || metrics.length === 0) {
      this.logger.debug('No metrics found for analysis');
      return;
    }

    for (const metric of metrics) {
      this.logger.debug(`Analyzing metric: ${metric.name}`);
      await this.analyzeMetric(metric);
    }
   } catch (error) {
    this.logger.error('Error in scheduled metric analysis', error);
    PrismaErrorHandler.handle(error);
   }
  }

  private async analyzeMetric(metric: any) {
    
    if (!metric.service?.prometheusConfig?.url) {
      this.logger.warn(`Prometheus config missing for metric ${metric.name}`);
      return;
    }

    const prometheusUrl = metric.service.prometheusConfig.url;
    const zScoreQuery = `((${metric.promQL}) - avg_over_time(${metric.promQL}[30m])) / stddev_over_time(${metric.promQL}[30m])`;
    const fullUrl = `${prometheusUrl}/api/v1/query?query=${encodeURIComponent(zScoreQuery)}`;

    try {
      const response = await fetch(fullUrl);

      if (!response.ok) {

        return;
      }

      const body = await response.json();
      const resultData = body.data?.result;

      if (resultData && resultData.length > 0) {
        const rawValue = resultData[0].value[1];
        let zScoreValue = parseFloat(rawValue);

        if (!isFinite(zScoreValue) || isNaN(zScoreValue)) {
          zScoreValue = 0;
        } else {
          zScoreValue = Math.abs(zScoreValue);
        }

        if (zScoreValue > metric.zScoreThreshold) {
          this.logger.error(`Anomaly detected in ${metric.name}: ${zScoreValue}`);
          await this.alertsService.create({
            metricId: metric.id,
            value: zScoreValue,
            zScoreValue: zScoreValue,
            severity: zScoreValue > (metric.zScoreThreshold * 2) ? 'CRITICAL' : 'HIGH',
          });
        }
      }
    } catch (error) {
      this.logger.error(error.message);
      PrismaErrorHandler.handle(error);
    }
  }

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