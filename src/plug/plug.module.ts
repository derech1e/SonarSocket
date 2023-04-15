import { Module } from '@nestjs/common';
import { PlugController } from "./plug.controller";
import { PlugService } from "./plug.service";

@Module({
  controllers: [PlugController],
  providers: [PlugService],

})
export class PlugModule {}
