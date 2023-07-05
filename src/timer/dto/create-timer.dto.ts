import { IsInt } from "class-validator";

export class CreateTimerDto {
  @IsInt()
  duration: number;
}
