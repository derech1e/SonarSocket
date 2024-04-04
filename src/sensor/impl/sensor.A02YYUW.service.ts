import { Injectable } from "@nestjs/common";
import { ISensorService } from "../interface/ISensorService";
import { InjectModel } from "@nestjs/mongoose";
import { SensorData } from "../../scheduler/entities/scheduler-sensor.entity";
import { Model } from "mongoose";
import { ISensorData } from "../interface/ISensorData";
import { SerialPort } from "serialport";

@Injectable()
export class SensorA02YYUWService implements ISensorService {
  private LAST_MEASUREMENT = -1;
  private LAST_DATE = new Date();

  constructor(
    @InjectModel(SensorData.name) private sensorDataModel: Model<SensorData>,
  ) {
    const serialPort = new SerialPort({ path: "/dev/serial0", baudRate: 9600 });
    serialPort.on("data", this.parseSerialData);
  }

  getAllMeasurements(): Promise<SensorData[]> {
    return this.sensorDataModel
      .find({
        datetime: {
          $gte: new Date(Date.now() - 1000 * 60 * 60 * 1000), // Only return the entries of the last 1000h
        },
      })
      .select({ datetime: 1, distance: 1, _id: 0 })
      .exec();
  }

  isMinDistanceReached(): Promise<boolean> {
    return Promise.resolve(false);
  }

  measureDistance(): Promise<ISensorData> {
    return new Promise((resolve) => {
      resolve({
        status: "SUCCESS",
        datetime: this.LAST_DATE,
        distance: this.LAST_MEASUREMENT,
      });
    });
  }

  // https://wiki.dfrobot.com/_A02YYUW_Waterproof_Ultrasonic_Sensor_SKU_SEN0311
  parseSerialData = (data) => {
    // Assuming receivedData is an array of bytes [0xFF, DATA_H, DATA_L, SUM]
    const HEADER = 0xff;
    const DATA_HIGH = data[1];
    const DATA_LOW = data[2];
    const SUM = data[3];

    // Verify checksum (always ends with: '& 0x00FF')
    const calculatedSUM = (HEADER + DATA_HIGH + DATA_LOW) & 0x00ff;
    if (SUM !== calculatedSUM) {
      console.error("Checksum mismatch! Data may be corrupted.");
      return null;
    }

    // update date
    this.LAST_DATE = new Date(Date.now());

    // Calculate distance
    return (this.LAST_MEASUREMENT = DATA_HIGH * 256 + DATA_LOW); // Distance in millimeters;
  };
}
