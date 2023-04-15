import { Body, Controller, Get, HttpException, HttpStatus, Post } from "@nestjs/common";
import { SchedulerService } from "./scheduler.service";
import { CreateSchedulerDto } from "./dto/create-scheduler.dto";
import * as config from "../../plug-config.json";
import fs from "fs";

@Controller("scheduler")
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {
  }

  @Get("/jobs")
  getSchedulerJobs(): any {
    return this.schedulerService.getSchedulerJobs();
  }

  @Post("/jobs")
  async createSchedulerJob(@Body() createSchedulerJobDto: CreateSchedulerDto): Promise<any> {
    if (this.schedulerService.isOverlappingJob(createSchedulerJobDto)) {
      throw new HttpException("A job already exists at the given time", HttpStatus.CONFLICT);
    }

    // Add the new job to the config file
    config.push(createSchedulerJobDto);

    const jsonConfig = JSON.stringify(config, null, 2);

    fs.writeFile("./plug-config.json", jsonConfig, "utf8", (err) => {
      if (err) {
        throw new HttpException("Could not save the new job", HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });

    // Return the updated config file
    return this.schedulerService.getSchedulerJobs();
  }
}
