import { Injectable, Logger } from "@nestjs/common";
import * as config from "../../plug-config.json";
import { Cron, CronExpression } from "@nestjs/schedule";
import { DayOfWeek } from "./dto/CreateSchedulreJobDto";


@Injectable()
export class PlugService {

  private readonly logger = new Logger(PlugService.name);
  private isOn: boolean = false;

  getSchedulerJobs() {
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

  isOverlappingJob(createSchedulerJobDto: any): boolean {
    if (!createSchedulerJobDto) {
      throw new Error("Invalid input");
    }

    return config.some(job => {
      // Check if there's any day overlap between the two jobs
      const dayOverlap = job.dayOfWeek.some(day => createSchedulerJobDto.dayOfWeek.includes(day));
      // Check if the start time of the new job is within the range of the existing job
      const startTimeOverlap = createSchedulerJobDto.startTime < job.endTime && createSchedulerJobDto.startTime >= job.startTime;
      // Check if the end time of the new job is within the range of the existing job
      const endTimeOverlap = createSchedulerJobDto.endTime <= job.endTime && createSchedulerJobDto.endTime > job.startTime;
      // Check if the start and end times are the same
      const sameTime = createSchedulerJobDto.startTime === job.startTime && createSchedulerJobDto.endTime === job.endTime;
      // Check if the end time is greater than the start time
      const validTimeRange = createSchedulerJobDto.endTime > createSchedulerJobDto.startTime;

      return dayOverlap && (startTimeOverlap || endTimeOverlap || sameTime) && validTimeRange;
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handlePlug() {
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