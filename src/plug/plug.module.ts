import { Module } from "@nestjs/common";
import { PlugController } from "./plug.controller";
import { PlugService } from "./plug.service";
import { HttpModule } from "@nestjs/axios";
import { SensorService } from "../sensor/sensor.service";
import { MongooseModule } from "@nestjs/mongoose";
import { SensorData, SensorDataSchema } from "../scheduler/entities/scheduler-sensor.entity";

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: SensorData.name, schema: SensorDataSchema }
    ])
  ],
  controllers: [PlugController],
  providers: [PlugService, SensorService],
  exports: [PlugService]
})
export class PlugModule {
}
