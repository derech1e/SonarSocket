import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DayOfWeek } from '../dto/create-scheduler.dto';

export type SchedulerDocument = HydratedDocument<Scheduler>;

@Schema({ _id: true, timestamps: { createdAt: true } })
export class Scheduler {

  @Prop({ default: true })
  isActive: boolean = true;

  @Prop({ required: true, type: [String], enum: DayOfWeek })
  dayOfWeek: DayOfWeek[];

  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;
}

export const SchedulerSchema = SchemaFactory.createForClass(Scheduler);
