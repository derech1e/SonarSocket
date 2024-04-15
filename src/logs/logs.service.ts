import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
  Action,
  Log,
  LogDocument,
  LogTyp,
  Module,
} from "./entities/log.entity";
import { Model } from "mongoose";

@Injectable()
export class LogsService {
  constructor(@InjectModel(Log.name) private logModel: Model<LogDocument>) {}

  async log(
    module: Module,
    action: Action,
    logTyp: LogTyp = LogTyp.INFO,
    message: string = "",
  ): Promise<Log> {
    const log = new this.logModel({
      module,
      action,
      logTyp,
      message,
    });
    return log.save();
  }

  async getLogs(): Promise<Log[]> {
    return this.logModel.find().exec();
  }
}
