import { Module } from '@nestjs/common';
import { SensorGateway } from './sensor.gateway';
import { SensorService } from './sensor.service';

@Module({
  providers: [SensorGateway, SensorService],
  exports: [SensorService],
})
export class SensorModule {}
