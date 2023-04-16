import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type SensorDataDocument = HydratedDocument<SensorData>;

@Schema()
export class SensorData {
  @Prop({ required: true, type: Date })
  datetime: Date;

  @Prop({ required: true, type: Number })
  distance: number;

  @Prop({ required: true, type: String })
  status: string;
}

export const SensorDataSchema = SchemaFactory.createForClass(SensorData);