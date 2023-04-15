import { IsBoolean } from "class-validator";

export class UpdatePlugDto {
  @IsBoolean()
  state: "ON" | "OFF";
}