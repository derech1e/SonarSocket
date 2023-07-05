import { Body, Controller, Get, Post } from "@nestjs/common";
import { LogsService } from "./logs.service";

@Controller("logs")
export class LogsController {
  constructor(private readonly logsService: LogsService) {
  }

  @Post()
  async createLog(@Body() body: { action: string }) {
    return await this.logsService.createLog(body.action);
  }

  @Get()
  async getLogs() {
    return this.logsService.getLogs();
  }
}
