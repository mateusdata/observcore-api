import { Module } from '@nestjs/common';
import { PrometheusConfigsService } from './prometheus-configs.service';
import { PrometheusConfigsController } from './prometheus-configs.controller';

@Module({
  controllers: [PrometheusConfigsController],
  providers: [PrometheusConfigsService],
})
export class PrometheusConfigsModule {}
