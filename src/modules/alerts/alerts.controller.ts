import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/User';

@ApiTags('Alerts')
@ApiBearerAuth()
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) { }

  @Post()
  create(@Body() createDto: CreateAlertDto) {
    return this.alertsService.create(createDto);
  }

  @Get()
  findAll(@User('sub') userId: string) {
    return this.alertsService.findAll(userId);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDto: UpdateAlertDto) {
    return this.alertsService.update(id, updateDto);
  }
}