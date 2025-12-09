import { Injectable } from '@nestjs/common';
import { CreatePrometheusConfigDto } from './dto/create-prometheus-config.dto';
import { UpdatePrometheusConfigDto } from './dto/update-prometheus-config.dto';

@Injectable()
export class PrometheusConfigsService {
  create(createPrometheusConfigDto: CreatePrometheusConfigDto) {
    return 'This action adds a new prometheusConfig';
  }

  findAll() {
    return `This action returns all prometheusConfigs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} prometheusConfig`;
  }

  update(id: number, updatePrometheusConfigDto: UpdatePrometheusConfigDto) {
    return `This action updates a #${id} prometheusConfig`;
  }

  remove(id: number) {
    return `This action removes a #${id} prometheusConfig`;
  }
}
