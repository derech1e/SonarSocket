import { PartialType } from '@nestjs/mapped-types';
import { CreateSchedulerDto } from './create-scheduler.dto';
import { IsNumber } from 'class-validator';

export class UpdateSchedulerDto extends PartialType(CreateSchedulerDto) {
  @IsNumber()
  id: number;
}
