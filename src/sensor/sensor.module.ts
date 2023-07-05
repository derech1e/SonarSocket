import { Module } from "@nestjs/common";
import { SensorGateway } from "./sensor.gateway";
import { SensorService } from "./sensor.service";
import { MongooseModule } from "@nestjs/mongoose";
import { SensorData, SensorDataSchema } from "../scheduler/entities/scheduler-sensor.entity";
import { SensorController } from "./sensor.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SensorData.name, schema: SensorDataSchema },
    ]),
  ],
  controllers: [SensorController],
  providers: [SensorGateway, SensorService],
  exports: [SensorService],
})
export class SensorModule {}
