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
    if (this.plugService.isOverlappingJob(createSchedulerJobDto)) {
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
    return this.plugService.getSchedulerJobs();
  }
}