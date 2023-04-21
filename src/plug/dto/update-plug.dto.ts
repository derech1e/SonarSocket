import { IsBoolean } from "class-validator";

export class UpdatePlugDto {
  @IsBoolean()
  POWER1: "ON" | "OFF";
}