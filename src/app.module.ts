import { Module } from '@nestjs/common';
import { SocketModule } from './socket/socket.module';
import { PlugModule } from "./plug/plug.module";

@Module({
  imports: [PlugModule],
})
export class AppModule {}
