import { Injectable } from "@nestjs/common";
import { CreateTimerDto } from "./dto/create-timer.dto";
import { interval, Observable, Subscription } from "rxjs";

@Injectable()
export class TimerService {
  private timer$: Observable<number>;
  private subscription: Subscription;
  private remainingTime: number;

  constructor() {
    this.timer$ = interval(1000);
    this.subscription = new Subscription();
  }

  startTimer(createTimerDto: CreateTimerDto): Observable<number> {
    if (!this.subscription || this.subscription.closed || !this.remainingTime) {
      this.remainingTime = createTimerDto.duration;
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
    this.subscription.unsubscribe();
  }

  resumeTimer(): Observable<number> {
    if (
      (!this.subscription || this.subscription.closed) &&
      this.remainingTime
    ) {
      return this.startTimer({ duration: this.remainingTime });
    } else {
      return null;
    }
  }

  stopTimer() {
    this.subscription.unsubscribe();
    this.remainingTime = null;
  }
}
