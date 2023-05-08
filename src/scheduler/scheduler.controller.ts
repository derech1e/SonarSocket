import {
  Body,
  Controller, Delete,
  Get,
  HttpException,
  HttpStatus, Param, Patch,
  Post, Put
} from "@nestjs/common";
import { SchedulerService } from './scheduler.service';
import { CreateSchedulerDto } from './dto/create-scheduler.dto';
import { Scheduler } from './entities/scheduler.entity';
import { ObjectId } from "mongoose";
import { UpdateSchedulerDto } from "./dto/update-scheduler.dto";

@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Get('/jobs')
  async getSchedulerJobs(): Promise<Scheduler[]> {
    return await this.schedulerService.getSchedulerJobs();
  }

  @Get('/jobs/:_id')
  async getSchedulerJob(@Param() _id: ObjectId): Promise<Scheduler> {
    return await this.schedulerService.getSchedulerJob(_id);
  }

  @Put('/jobs/:_id')
  async updateEnabledStatus(@Param() _id: ObjectId, @Body() scheduler: UpdateSchedulerDto) {
    return await this.schedulerService.updateSchedulerJob(_id, scheduler);
  }

  @Patch('/jobs/:_id')
  async updateSchedulerJobActiveStatus(@Param() _id: ObjectId, @Body() scheduler: UpdateSchedulerDto) {
    return await this.schedulerService.updateSchedulerJobActive(_id, scheduler.isActive);
  }

  @Delete('/jobs/:_id')
  async deleteSchedulerJob(@Param() _id: ObjectId) {
    return await this.schedulerService.deleteSchedulerJob(_id);
  }

  @Post('/jobs')
  async createSchedulerJob(@Body() createSchedulerJobDto: CreateSchedulerDto) {
    if (await this.schedulerService.isOverlappingJob(createSchedulerJobDto)) {
      throw new HttpException(
        'A job already exists at the given time',
        HttpStatus.CONFLICT,
      );
    }

    return this.schedulerService.createSchedulerJob(createSchedulerJobDto);
  }
}
