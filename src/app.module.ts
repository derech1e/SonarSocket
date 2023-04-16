import { Module } from "@nestjs/common";
import { PlugModule } from "./plug/plug.module";
import { ScheduleModule } from "@nestjs/schedule";
import { SchedulerModule } from "./scheduler/scheduler.module";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: 'mongodb+srv://PumpAdminLinux:924B38LhTb4jKWLt@cluster0.jso71gc.mongodb.net/test?retryWrites=true&w=majority',
      }),
    }),
    PlugModule,
    SchedulerModule,
  ]
})
export class AppModule {
}