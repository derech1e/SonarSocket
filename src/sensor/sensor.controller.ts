import { Controller, Get, Inject } from "@nestjs/common";
import { SensorData } from "../scheduler/entities/scheduler-sensor.entity";
import { ISensorService, SENSOR_SERVICE } from "./interface/ISensorService";

@Controller("sensor")
export class SensorController {
  constructor(
    @Inject(SENSOR_SERVICE)
    private readonly sensorService: ISensorService,
  ) {}

  @Get("/")
  async getAllMeasurements(): Promise<SensorData[]> {
    return await this.sensorService.getAllMeasurements();
  }

  @Get("/delete")
  async deleteMeasurements() {
    return null;
  }
}
