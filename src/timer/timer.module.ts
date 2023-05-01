import { Module } from '@nestjs/common';
import { TimerService } from './timer.service';
import { TimerGateway } from './timer.gateway';
import { PlugService } from '../plug/plug.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [TimerGateway, TimerService, PlugService],
})
export class TimerModule {}
