import { Injectable } from "@nestjs/common";
import { Gpio } from "pigpio";
import { InjectModel } from "@nestjs/mongoose";
import { SensorData } from "../../scheduler/entities/scheduler-sensor.entity";
import { Model } from "mongoose";
import { ISensorService } from "../interface/ISensorService";
import { ISensorData } from "../interface/ISensorData";
import * as process from "process";

@Injectable()
export class SensorJSNSR04TService implements ISensorService {
  private readonly TRIGGER_GPIO: number = 23;
  private readonly ECHO_GPIO: number = 24;
  private readonly SOUND_SPEED_CM_PER_SEC: number = 34300; // Speed of sound in cm/s 34000 => 15°C | 3313 => 0°C

  constructor(
    @InjectModel(SensorData.name) private sensorDataModel: Model<SensorData>,
  ) {
    console.log("Init JSNR04T");
    console.log(process.env.SENSOR_TYPE);
  }

  async isMinDistanceReached(): Promise<boolean> {
    return (await this.measureDistance(1000)).distance > 243.67 - 13;
  }

  async getAllMeasurements(): Promise<SensorData[]> {
    return this.sensorDataModel
      .find()
      .select({ datetime: 1, distance: 1, _id: 0 })
      .exec();
  }

  async measureDistance(timeout: number): Promise<ISensorData> {
    const trigger = new Gpio(this.TRIGGER_GPIO, { mode: Gpio.OUTPUT });
    const echo = new Gpio(this.ECHO_GPIO, { mode: Gpio.INPUT, alert: true });

    return new Promise((resolve) => {
      let startTick: number;
      echo.on("alert", (level: number, tick: number) => {
        if (level === 1) {
          startTick = tick;
        } else {
          const diff = (tick >> 0) - (startTick >> 0); // Unsigned 32-bit arithmetic
          const duration = diff / 1000000; // Convert to seconds
          const distance = (duration * this.SOUND_SPEED_CM_PER_SEC) / 2; // Distance = speed * time / 2
          clearTimeout(timeoutId);
          if (distance < 1190) {
            resolve({
              status: "SUCCESS",
              datetime: new Date(Date.now() + 7200000),
              distance,
              sensor: { triggerTick: startTick, echoTick: tick, diff },
            });
          }
          // } else {
          //   resolve({
          //     status: "TOO_FAR_AWAY",
          //     time: new Date(),
          //     distance,
          //     sensor: { triggerTick: startTick, echoTick: tick, diff }
          //   });
          // }
        }
      });
      trigger.trigger(10, 1); // Send 10us trigger pulse
      const timeoutId = setTimeout(() => {
        echo.removeAllListeners("alert");
        resolve({
          status: "TIMEOUT",
          datetime: new Date(Date.now() + 7200000),
          distance: null,
          sensor: null,
        });
      }, timeout);
    });
  }
}
