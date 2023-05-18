import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PlugService } from "../plug/plug.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SensorData } from "./entities/scheduler-sensor.entity";
import { SensorService } from "../sensor/sensor.service";
import { Scheduler } from "./entities/scheduler.entity";
import { CreateSchedulerDto, DayOfWeek } from "./dto/create-scheduler.dto";
import { UpdateSchedulerDto } from "./dto/update-scheduler.dto";

@Injectable()
export class SchedulerService {
  private readonly logger: Logger = new Logger(SchedulerService.name);
  private isAnyJobActive = false;

  constructor(
    private readonly plugService: PlugService,
    private readonly sensorService: SensorService,
    @InjectModel(SensorData.name) private sensorDataModel: Model<SensorData>,
    @InjectModel(Scheduler.name) private schedulerDataModel: Model<Scheduler>
  ) {
  }

  async getSchedulerJobs(): Promise<Scheduler[]> {
    return this.schedulerDataModel.find().exec();
  }

  async getSchedulerJob(_id: string): Promise<Scheduler> {
    return this.schedulerDataModel.findById(_id).exec();
  }

  async updateSchedulerJob(_id: string, scheduler: UpdateSchedulerDto) {
    const overlapping = await this.isOverlappingJob(scheduler);
    if (overlapping.isOverlapping && overlapping._id != _id) {
      throw new HttpException(
        "A job already exists at the given time",
        HttpStatus.CONFLICT
      );
    }
    return this.schedulerDataModel.findOneAndUpdate({ _id }, scheduler, { new: true }).exec();
  }

  async updateSchedulerJobActive(_id: string, isActive: boolean) {
    return this.schedulerDataModel.findOneAndUpdate({ _id }, { isActive }, { new: true }).exec();
  }

  async deleteSchedulerJob(_id: string) {
    return this.schedulerDataModel.findOneAndDelete({ _id }).exec();
  }

  async createSchedulerJob(createSchedulerJobDto: CreateSchedulerDto) {
    if (!createSchedulerJobDto) {
      throw new HttpException("Invalid input", HttpStatus.BAD_REQUEST);
    }

    const schedulerJob = new this.schedulerDataModel(createSchedulerJobDto);
    return schedulerJob.save({ validateBeforeSave: true });
  }

  async isOverlappingJob(createSchedulerJobDto: CreateSchedulerDto | UpdateSchedulerDto): Promise<{
    _id: string,
    isOverlapping: boolean
  }> {
    if (!createSchedulerJobDto) {
      throw new HttpException("Invalid input", HttpStatus.BAD_REQUEST);
    }

    if (createSchedulerJobDto.startTime >= createSchedulerJobDto.endTime) {
      throw new HttpException("'startTime' must be before 'endTime'",
        HttpStatus.BAD_REQUEST);
    }

    const jobs = await this.getSchedulerJobs();
    let lastJobId = "";

    const overLapping = jobs.some((job) => {
      // Check if there's any day overlap between the two jobs
      const dayOverlap = job.dayOfWeek.some((day) =>
        createSchedulerJobDto.dayOfWeek.includes(day)
      );
      // Check if the start time of the new job is within the range of the existing job
      const startTimeOverlap =
        createSchedulerJobDto.startTime < job.endTime &&
        createSchedulerJobDto.startTime >= job.startTime;
      // Check if the end time of the new job is within the range of the existing job
      const endTimeOverlap =
        createSchedulerJobDto.endTime <= job.endTime &&
        createSchedulerJobDto.endTime > job.startTime;
      // Check if the start and end times are the same
      const sameTime =
        createSchedulerJobDto.startTime === job.startTime &&
        createSchedulerJobDto.endTime === job.endTime;
      // Check if the end time is greater than the start time
      const validTimeRange =
        createSchedulerJobDto.endTime > createSchedulerJobDto.startTime;
      lastJobId = job._id;

      return (
        dayOverlap &&
        (startTimeOverlap || endTimeOverlap || sameTime) &&
        validTimeRange
      );
    });
    return { _id: lastJobId, isOverlapping: overLapping };
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handlePlug() {
    const jobs = await this.getSchedulerJobs();
    const now = new Date();
    const today = now.toLocaleDateString("en-US", { weekday: "long" });
    const currentTime = now.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit"
    });

    this.logger.debug("Checking jobs...");

    for (const job of jobs) {
      if (job.dayOfWeek.includes(<DayOfWeek>today)) {
        if (currentTime >= job.startTime && currentTime < job.endTime) {
          if (!this.isAnyJobActive) {
            await this.plugService.updatePlugStatus({ POWER1: "ON" });
            this.logger.debug(`Plug turned on for job ${job}`);
            this.isAnyJobActive = true;
            break;
          }
        } else {
          if (this.isAnyJobActive) {
            await this.plugService.updatePlugStatus({ POWER1: "OFF" });
            this.logger.debug(`Plug turned off for job ${job}`);
            this.isAnyJobActive = false;
          }
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
