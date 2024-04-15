import { Module } from "@nestjs/common";
import { TimerService } from "./timer.service";
import { TimerGateway } from "./timer.gateway";
import { PlugService } from "../plug/plug.service";
import { HttpModule } from "@nestjs/axios";
import { MongooseModule } from "@nestjs/mongoose";
import {
  SensorData,
  SensorDataSchema,
} from "../scheduler/entities/scheduler-sensor.entity";
import { SensorModule } from "../sensor/sensor.module";
import { LogsModule } from "../logs/logs.module";

@Module({
  imports: [
    HttpModule,
    SensorModule,
    LogsModule,
    MongooseModule.forFeature([
      { name: SensorData.name, schema: SensorDataSchema },
    ]),
  ],
  providers: [TimerGateway, TimerService, PlugService],
})
export class TimerModule {}
