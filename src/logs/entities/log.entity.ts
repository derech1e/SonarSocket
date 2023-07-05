import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type LogDocument = HydratedDocument<Log>;

@Schema({ timestamps: { createdAt: true } })
export class Log {
  @Prop({ required: true })
  action: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);
