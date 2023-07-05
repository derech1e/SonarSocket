import { PartialType } from "@nestjs/mapped-types";
import { CreateSchedulerDto } from "./create-scheduler.dto";
import { IsBoolean } from "class-validator";

export class UpdateSchedulerDto extends PartialType(CreateSchedulerDto) {
  @IsBoolean()
  isActive: boolean;
}
