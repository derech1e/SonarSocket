import { Body, Controller, Get, Post } from "@nestjs/common";
import { LogsService } from "./logs.service";

@Controller("logs")
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  async getLogs() {
    return this.logsService.getLogs();
  }
}
