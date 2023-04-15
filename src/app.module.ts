import { Module } from "@nestjs/common";
import { PlugModule } from "./plug/plug.module";
import { ScheduleModule } from "@nestjs/schedule";
import { SchedulerModule } from "./scheduler/scheduler.module";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PlugModule,
    SchedulerModule,
  ]
})
export class AppModule {
}
