import { Module } from "@nestjs/common";
import { TimerService } from "./timer.service";
import { TimerGateway } from "./timer.gateway";
import { PlugService } from "../plug/plug.service";
import { HttpModule } from "@nestjs/axios";
import { SensorService } from "../sensor/sensor.service";
import { MongooseModule } from "@nestjs/mongoose";
import { SensorData, SensorDataSchema } from "../scheduler/entities/scheduler-sensor.entity";

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: SensorData.name, schema: SensorDataSchema }])
  ],
  providers: [TimerGateway, TimerService, PlugService, SensorService]
})
export class TimerModule {
}
