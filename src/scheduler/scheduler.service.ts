import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PlugService } from "../plug/plug.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SensorData } from "./entities/scheduler-sensor.entity";
import { SensorService } from "../sensor/sensor.service";
import { Scheduler } from "./entities/scheduler.entity";
import { CreateSchedulerDto, DayOfWeek } from "./dto/create-scheduler.dto";

@Injectable()
export class SchedulerService {

  private readonly logger: Logger = new Logger(SchedulerService.name);

  constructor(
    private readonly plugService: PlugService,
    private readonly sensorService: SensorService,
    @InjectModel(SensorData.name) private sensorDataModel: Model<SensorData>,
    @InjectModel(Scheduler.name) private schedulerDataModel: Model<Scheduler>
  ) {
  }

  async getSchedulerJobs() {
    return this.schedulerDataModel.find().exec();
  }

  async createSchedulerJob(createSchedulerJobDto: CreateSchedulerDto) {
    if (!createSchedulerJobDto) {
      throw new Error("Invalid input");
    }

    const schedulerJob = new this.schedulerDataModel(createSchedulerJobDto);
    return schedulerJob.save({ validateBeforeSave: true });
  }

  async isOverlappingJob(createSchedulerJobDto: any): Promise<boolean> {
    if (!createSchedulerJobDto) {
      throw new Error("Invalid input");
    }

    const jobs = await this.getSchedulerJobs();

    return jobs.some(job => {
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
      if (job.dayOfWeek.includes(<DayOfWeek>today)) {
        if (currentTime >= job.startTime && currentTime <= job.endTime) {
          await this.plugService.updatePlugStatus({ state: "ON" });
          this.logger.debug(`Plug turned on for job ${job}`);
        } else {
          await this.plugService.updatePlugStatus({ state: "OFF" });
          this.logger.debug(`Plug turned off for job ${job}`);
        }
      }
    }
  }

  @Cron("*/5 6-21 * * *")
  async logSensorData() {
    const data = await this.sensorService.measureDistance(100);
    const sensorData = new this.sensorDataModel({
      datetime: data.datetime,
      distance: data.distance,
      status: data.status
    });
    await sensorData.save({ validateBeforeSave: true });
    this.logger.debug(`Logged sensor data: ${JSON.stringify(data)}`);
  }
}
