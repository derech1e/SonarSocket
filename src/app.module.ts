import { Module } from "@nestjs/common";
import { SocketModule } from "./socket/socket.module";
import { PlugModule } from "./plug/plug.module";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    PlugModule,
    ScheduleModule.forRoot()
  ]
})
export class AppModule {
}
