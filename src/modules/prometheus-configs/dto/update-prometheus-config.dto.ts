import { PartialType } from '@nestjs/swagger';
import { CreatePrometheusConfigDto } from './create-prometheus-config.dto';

export class UpdatePrometheusConfigDto extends PartialType(CreatePrometheusConfigDto) {}
