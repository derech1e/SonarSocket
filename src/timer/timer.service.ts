import { Injectable } from "@nestjs/common";
import { CreateTimerDto } from "./dto/create-timer.dto";
import { interval, Observable, Subscription } from "rxjs";
import { LogsService } from "../logs/logs.service";
import { Action, Module } from "../logs/entities/log.entity";

@Injectable()
export class TimerService {
  public remainingTime: number;
  public requestedDuration: number; // The requested time is the total duration requested by the client
  private timer$: Observable<number>;
  private subscription: Subscription;

  constructor(private readonly _logsService: LogsService) {
    this.timer$ = interval(1000);
    this.subscription = new Subscription();
  }

  startTimer(createTimerDto: CreateTimerDto): Observable<number> {
    if (!this.subscription || this.subscription.closed || !this.remainingTime) {
      this.remainingTime = createTimerDto.duration;
      this.requestedDuration = createTimerDto.duration;
      this._logsService.log(Module.TIMER, Action.START_TIMER);
      return new Observable<number>((observer) => {
        this.subscription = this.timer$.subscribe(() => {
          this.remainingTime -= 1;
          observer.next(this.remainingTime);
          if (this.remainingTime === 0) {
            observer.complete();
          }
        });
      });
    } else {
      return null;
    }
  }

  pauseTimer() {
    this._logsService.log(Module.TIMER, Action.PAUSE_TIMER);
    this.subscription.unsubscribe();
  }

  resumeTimer(): Observable<number> {
    if (
      (!this.subscription || this.subscription.closed) &&
      this.remainingTime
    ) {
      this._logsService.log(Module.TIMER, Action.RESUME_TIMER);
      return this.startTimer({ duration: this.remainingTime });
    } else {
      return null;
    }
  }

  stopTimer() {
    this.subscription.unsubscribe();
    this.remainingTime = null;
    this._logsService.log(Module.TIMER, Action.STOP_TIMER);
  }
}
