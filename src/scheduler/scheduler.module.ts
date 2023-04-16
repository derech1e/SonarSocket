import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { SchedulerController } from './scheduler.controller';
import { PlugService } from "../plug/plug.service";
import { MongooseModule } from "@nestjs/mongoose";
import { SensorData, SensorDataSchema } from "./entities/scheduler-sensor.entity";
import { SensorService } from "../sensor/sensor.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [MongooseModule.forFeature([{ name: SensorData.name, schema: SensorDataSchema }]), HttpModule],
  controllers: [SchedulerController],
  providers: [SchedulerService, PlugService, SensorService],
})
export class SchedulerModule {}
