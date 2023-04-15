import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { SchedulerController } from './scheduler.controller';
import { PlugService } from "../plug/plug.service";

@Module({
  controllers: [SchedulerController],
  providers: [SchedulerService, PlugService],
})
export class SchedulerModule {}
