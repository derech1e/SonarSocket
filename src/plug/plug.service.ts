import { Injectable } from "@nestjs/common";
import * as config from "../../plug-config.json";
import { Cron, CronExpression } from "@nestjs/schedule";


@Injectable()
export class PlugService {

  private isOn: boolean = false;

  async getSchedulerJobs() {
    return config;
  }

  async turnOn() {
    this.isOn = true;
  }

  async turnOff() {
    this.isOn = false;
  }

  isPlugOn(): boolean {
    return this.isOn;
  }
  @Cron(CronExpression.EVERY_MINUTE)
  async handleLight() {

    const jobs = await this.getSchedulerJobs();
    const now = new Date();
    const today = now.toLocaleDateString("en-US", { weekday: "long" });
    const currentTime = now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });

    for (const job of jobs) {
      if (job.dayOfWeek.includes(today)) {
        if (currentTime >= job.startTime && currentTime <= job.endTime) {
          await this.turnOn();
        } else {
          await this.turnOff();
        }
      }
    }
  }

}