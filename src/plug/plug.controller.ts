import { Body, Controller, Get, Patch } from "@nestjs/common";
import { PlugService } from "./plug.service";
import { UpdatePlugDto } from "./dto/update-plug.dto";
import { PlugState } from "./interface/PlugState";

@Controller("plug")
export class PlugController {
  constructor(private readonly plugService: PlugService) {
  }

  @Get("/status")
  async getPlugStatus(): Promise<PlugState> {
    return await this.plugService.getPlugState();
  }

  @Patch("/status")
  async updatePlugStatus(
    @Body() updatePlugDto: UpdatePlugDto,
  ): Promise<PlugState> {
    return this.plugService.updatePlugStatus(updatePlugDto);
  }
}
