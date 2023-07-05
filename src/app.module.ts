import { Module } from "@nestjs/common";
import { PlugModule } from "./plug/plug.module";
import { ScheduleModule } from "@nestjs/schedule";
import { SchedulerModule } from "./scheduler/scheduler.module";
import { MongooseModule } from "@nestjs/mongoose";
import { TimerModule } from "./timer/timer.module";
import { SensorModule } from "./sensor/sensor.module";
import { LogsModule } from "./logs/logs.module";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: "mongodb+srv://PumpAdminLinux:924B38LhTb4jKWLt@cluster0.jso71gc.mongodb.net/sonarsocket?retryWrites=true&w=majority"
      })
    }),
    PlugModule,
    SchedulerModule,
    TimerModule,
    SensorModule,
    LogsModule,
  ],
})
export class AppModule {}
