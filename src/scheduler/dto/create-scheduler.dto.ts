import { IsArray, IsEnum, IsString, Matches } from "class-validator";

export enum DayOfWeek {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}

export class CreateSchedulerDto {
  @IsEnum(DayOfWeek, { each: true })
  @IsArray()
  dayOfWeek: DayOfWeek[];

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Invalid time format. Use the following format HH:MM",
  })
  startTime: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Invalid time format. Use the following format HH:MM",
  })
  endTime: string;
}
