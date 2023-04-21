import { Body, Controller, Get, HttpException, HttpStatus, Post } from "@nestjs/common";
import { SchedulerService } from "./scheduler.service";
import { CreateSchedulerDto } from "./dto/create-scheduler.dto";
import { Scheduler } from "./entities/scheduler.entity";

@Controller("scheduler")
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {
  }

  @Get("/jobs")
  async getSchedulerJobs(): Promise<Scheduler[]> {
    return await this.schedulerService.getSchedulerJobs();
  }

  @Post("/jobs")
  async createSchedulerJob(@Body() createSchedulerJobDto: CreateSchedulerDto) {
    if (await this.schedulerService.isOverlappingJob(createSchedulerJobDto)) {
      throw new HttpException("A job already exists at the given time", HttpStatus.CONFLICT);
    }

    return this.schedulerService.createSchedulerJob(createSchedulerJobDto);
  }
}
