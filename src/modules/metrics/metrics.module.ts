import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';
import { AlertsService } from '../alerts/alerts.service';

@Module({
  controllers: [MetricsController],
  providers: [MetricsService, AlertsService],
})
export class MetricsModule {}
