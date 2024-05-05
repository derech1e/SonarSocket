import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type LogDocument = HydratedDocument<Log>;

export enum Module {
  PLUG = "PLUG",
  SCHEDULER = "SCHEDULER",
  SENSOR = "SENSOR",
  TIMER = "TIMER",
}

export enum LogTyp {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
}

export enum Action {
  ENABLE_PLUG = "ENABLE_PLUG",
  DISABLE_PLUG = "DISABLE_PLUG",
  UPDATE_PLUG_FAILSAFE = "UPDATE_PLUG_FAILSAFE",
  REQUEST_PLUG_STATUS = "REQUEST_PLUG_STATUS",

  CREATE_NEW_SCHEDULE = "CREATE_NEW_SCHEDULE",
  DELETE_SCHEDULE = "DELETE_SCHEDULE",
  UPDATE_SCHEDULE = "UPDATE_SCHEDULE",
  TOGGLE_SCHEDULE = "TOGGLE_SCHEDULE",
  CHECKING_SCHEDULE = "CHECKING_SCHEDULE",

  START_TIMER = "START_TIMER",
  STOP_TIMER = "STOP_TIMER",
  PAUSE_TIMER = "PAUSE_TIMER",
  RESUME_TIMER = "RESUME_TIMER",

  LISTEN_SENSOR = "LISTEN_SENSOR",
}

@Schema({
  timestamps: { createdAt: true, updatedAt: false },
  versionKey: false,
  timeseries: {
    timeField: "createdAt",
    granularity: "minutes",
  },
  expireAfterSeconds: 604800,
})
export class Log {
  @Prop({ required: true, type: String, enum: Module })
  module: Module;

  @Prop({ required: true, type: String, enum: Action })
  action: Action;

  @Prop({ required: true, type: String, enum: LogTyp })
  logTyp: LogTyp;

  @Prop({ required: false, default: "" })
  message: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);
