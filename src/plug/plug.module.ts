import { Module } from '@nestjs/common';
import { PlugController } from "./plug.controller";
import { PlugService } from "./plug.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  controllers: [PlugController],
  providers: [PlugService],
  exports: [PlugService]
})
export class PlugModule {}
