import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PrometheusConfigsService } from './prometheus-configs.service';
import { CreatePrometheusConfigDto } from './dto/create-prometheus-config.dto';
import { UpdatePrometheusConfigDto } from './dto/update-prometheus-config.dto';

@Controller('prometheus-configs')
export class PrometheusConfigsController {
  constructor(private readonly prometheusConfigsService: PrometheusConfigsService) {}

  @Post()
  create(@Body() createPrometheusConfigDto: CreatePrometheusConfigDto) {
    return this.prometheusConfigsService.create(createPrometheusConfigDto);
  }

  @Get()
  findAll() {
    return this.prometheusConfigsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prometheusConfigsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePrometheusConfigDto: UpdatePrometheusConfigDto) {
    return this.prometheusConfigsService.update(+id, updatePrometheusConfigDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prometheusConfigsService.remove(+id);
  }
}
