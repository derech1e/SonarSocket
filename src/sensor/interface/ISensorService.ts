import { SensorData } from "../../scheduler/entities/scheduler-sensor.entity";
import { ISensorData } from "./ISensorData";

export const SENSOR_SERVICE = "SENSOR SERVICE";

export interface ISensorService {
  isMinDistanceReached(): Promise<boolean>;

  getAllMeasurements(): Promise<SensorData[]>;

  measureDistance(timeout?: number): Promise<ISensorData>;
}
