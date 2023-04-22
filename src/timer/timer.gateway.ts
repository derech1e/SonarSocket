import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { TimerService } from "./timer.service";
import { Server } from "socket.io";
import { Logger, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateTimerDto } from "./dto/create-timer.dto";
import { PlugService } from "../plug/plug.service";

@UsePipes(new ValidationPipe({
  transform: true
}))
@WebSocketGateway({
  cors: {
    origin: "*"
  },
  namespace: "timer"
})
export class TimerGateway {

  @WebSocketServer() server: Server;
  private readonly ROOM_NAME = "timer";
  private readonly logger = new Logger(TimerGateway.name);

  constructor(private readonly timerService: TimerService, private readonly plugService: PlugService) {
  }


  @SubscribeMessage("startTimer")
  async handleStartTimer(client: any, payload: CreateTimerDto) {
    await this.plugService.updatePlugStatus({ POWER1: "ON" });
    const timer$ = this.timerService.startTimer(payload);

    if (!timer$) {
      this.server.emit(this.ROOM_NAME, "Timer already running.");
      return;
    }

    timer$.subscribe({
      next: time => {
        this.server.emit(this.ROOM_NAME, time);
      },
      complete: async () => {
        this.server.emit(this.ROOM_NAME, "Timer done.");
        await this.plugService.updatePlugStatus({ POWER1: "OFF" });
      }
    });
  }

  @SubscribeMessage("pauseTimer")
  async handlePauseTimer(client: any) {
    this.timerService.pauseTimer();
    await this.plugService.updatePlugStatus({ POWER1: "OFF" });
  }

  @SubscribeMessage("resumeTimer")
  async handleResumeTimer(client: any) {
    await this.plugService.updatePlugStatus({ POWER1: "ON" });
    const timer$ = this.timerService.resumeTimer();
    if (!timer$) {
      this.server.emit(this.ROOM_NAME, "The timer wasn't started or is already running.");
      return;
    }
    timer$.subscribe({
      next: time => {
        this.server.emit(this.ROOM_NAME, time);
      },
      complete: async () => {
        this.server.emit(this.ROOM_NAME, "done");
        await this.plugService.updatePlugStatus({ POWER1: "OFF" });
      }
    });
  }

  @SubscribeMessage("stopTimer")
  async handleStopTimer(client: any) {
    this.timerService.stopTimer();
    this.server.emit(this.ROOM_NAME, "Timer stopped.");
    await this.plugService.updatePlugStatus({ POWER1: "OFF" });
  }
}
