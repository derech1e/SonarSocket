import { Module } from "@nestjs/common";
import { SensorGateway } from "./sensor.gateway";
import { MongooseModule } from "@nestjs/mongoose";
import {
  SensorData,
  SensorDataSchema,
} from "../scheduler/entities/scheduler-sensor.entity";
import { SensorController } from "./sensor.controller";
import { SensorA02YYUWService } from "./impl/sensor.A02YYUW.service";
import { SENSOR_SERVICE } from "./interface/ISensorService";
import { LogsModule } from "../logs/logs.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SensorData.name, schema: SensorDataSchema },
    ]),
    LogsModule,
  ],
  controllers: [SensorController],
  providers: [
    SensorGateway,
    {
      provide: SENSOR_SERVICE,
      useClass: SensorA02YYUWService,
    },
  ],
  exports: [SENSOR_SERVICE],
})
export class SensorModule {}
