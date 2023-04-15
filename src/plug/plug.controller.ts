import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Query } from "@nestjs/common";
import { PlugService } from "./plug.service";
import * as config from "../../plug-config.json";
import { CreateSchedulerJobDto, DayOfWeek } from "./dto/CreateSchedulreJobDto";
import * as fs from "fs";

@Controller("plug")
export class PlugController {

  constructor(private readonly plugService: PlugService) {
  }

  @Get("/status")
  getLightStatus(): string {
    return this.plugService.isPlugOn ? "on" : "off";
  }

  @Get("/scheduler/jobs")
  getSchedulerJobs(): any {
    return this.plugService.getSchedulerJobs();
  }

  @Post("/scheduler/jobs")
  async createSchedulerJob(@Body() createSchedulerJobDto: CreateSchedulerJobDto): Promise<any> {

    const overlappingJob = config.find((job) => {
      // Check if there's any day overlap between the two jobs
      const dayOverlap = job.dayOfWeek.some((day: DayOfWeek) => createSchedulerJobDto.dayOfWeek.includes(day));

      // Check if the start time of the new job is within the range of the existing job
      const startTimeOverlap = (createSchedulerJobDto.startTime > job.startTime && createSchedulerJobDto.startTime < job.endTime);

      // Check if the end time of the new job is within the range of the existing job
      const endTimeOverlap = (createSchedulerJobDto.endTime > job.startTime && createSchedulerJobDto.endTime < job.endTime);

      // Check if the start and end times are the same
      const sameTime = (createSchedulerJobDto.startTime === job.startTime && createSchedulerJobDto.endTime === job.endTime);

      // Check if the end time is greater than the start time
      const endTimeGreaterThanStartTime = (createSchedulerJobDto.endTime > createSchedulerJobDto.startTime);

      return dayOverlap && ((startTimeOverlap || endTimeOverlap) || sameTime) && endTimeGreaterThanStartTime;
    });

    if (overlappingJob) {
      throw new HttpException("A job already exists at the given time", HttpStatus.CONFLICT);
    }

    // Add the new job to the config file
    config.push(createSchedulerJobDto);

    const jsonConfig = JSON.stringify(config, null, 2);

    fs.writeFile('./plug-config.json', jsonConfig, 'utf8', (err) => {
      if (err) {
        throw new HttpException("Could not save the new job", HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });

    // Return the updated config file
    return config;
  }
}