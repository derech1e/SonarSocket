import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Log, LogDocument } from "./entities/log.entity";
import { Model } from "mongoose";

@Injectable()
export class LogsService {
  constructor(@InjectModel(Log.name) private logModel: Model<LogDocument>) {
  }

  async createLog(action: string): Promise<Log> {
    const log = new this.logModel({
      action,
      timestamp: new Date()
    });
    return log.save();
  }

  async getLogs(): Promise<Log[]> {
    return this.logModel.find().exec();
  }
}
