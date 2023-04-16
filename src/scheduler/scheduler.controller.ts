import { Body, Controller, Get, HttpException, HttpStatus, Post } from "@nestjs/common";
import { SchedulerService } from "./scheduler.service";
import { CreateSchedulerDto } from "./dto/create-scheduler.dto";

@Controller("scheduler")
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {
  }

  @Get("/jobs")
  getSchedulerJobs(): any {
    return this.schedulerService.getSchedulerJobs();
  }

  @Post("/jobs")
  async createSchedulerJob(@Body() createSchedulerJobDto: CreateSchedulerDto) {
    if (await this.schedulerService.isOverlappingJob(createSchedulerJobDto)) {
      throw new HttpException("A job already exists at the given time", HttpStatus.CONFLICT);
    }

    return await this.schedulerService.createSchedulerJob(createSchedulerJobDto);
  }
}
