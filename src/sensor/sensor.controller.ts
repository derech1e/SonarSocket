import { Controller, Get } from "@nestjs/common";
import { SensorService } from "./sensor.service";
import { SensorData } from "../scheduler/entities/scheduler-sensor.entity";

@Controller("sensor")
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Get("/")
  async getAllMeasurements(): Promise<SensorData[]> {
    return await this.sensorService.getAllMeasurements();
  }
}
