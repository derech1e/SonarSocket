import { Module } from "@nestjs/common";
import { PlugController } from "./plug.controller";
import { PlugService } from "./plug.service";
import { HttpModule } from "@nestjs/axios";
import { MongooseModule } from "@nestjs/mongoose";
import {
  SensorData,
  SensorDataSchema,
} from "../scheduler/entities/scheduler-sensor.entity";
import { SensorModule } from "../sensor/sensor.module";

@Module({
  imports: [
    HttpModule,
    SensorModule,
    MongooseModule.forFeature([
      { name: SensorData.name, schema: SensorDataSchema },
    ]),
  ],
  controllers: [PlugController],
  providers: [PlugService],
  exports: [PlugService],
})
export class PlugModule {}
