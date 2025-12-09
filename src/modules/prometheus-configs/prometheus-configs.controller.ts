import { Controller, Get, Post, Body, Patch, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { PrometheusConfigsService } from './prometheus-configs.service';
import { CreatePrometheusConfigDto } from './dto/create-prometheus-config.dto';
import { UpdatePrometheusConfigDto } from './dto/update-prometheus-config.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/User';

@ApiTags('Prometheus Configs')
@ApiBearerAuth()
@Controller('prometheus-configs')
export class PrometheusConfigsController {
  constructor(private readonly prometheusConfigsService: PrometheusConfigsService) {}

  @Post()
  create(@User('sub') userId: string, @Body() createDto: CreatePrometheusConfigDto) {
    return this.prometheusConfigsService.create(userId, createDto);
  }

  @Get()
  findOne(@User('sub') userId: string) {
    return this.prometheusConfigsService.findOne(userId);
  }

  @Patch()
  update(@User('sub') userId: string, @Body() updateDto: UpdatePrometheusConfigDto) {
    return this.prometheusConfigsService.update(userId, updateDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  remove(@User('sub') userId: string) {
    return this.prometheusConfigsService.remove(userId);
  }
}