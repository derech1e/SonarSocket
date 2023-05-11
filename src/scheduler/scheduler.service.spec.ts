import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerService } from './scheduler.service';
import { CreateSchedulerDto, DayOfWeek } from './dto/create-scheduler.dto';
import { PlugService } from '../plug/plug.service';
import { SensorService } from '../sensor/sensor.service';
import { SchedulerController } from './scheduler.controller';
import { getModelToken } from '@nestjs/mongoose';
import { SensorData } from './entities/scheduler-sensor.entity';
import { Scheduler } from './entities/scheduler.entity';
import { HttpModule } from '@nestjs/axios';

describe('SchedulerService', () => {
  let service: SchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [SchedulerController],
      providers: [
        SchedulerService,
        PlugService,
        SensorService,
        {
          provide: getModelToken(SensorData.name),
          useClass: SensorData,
        },
        {
          provide: getModelToken(Scheduler.name),
          useClass: Scheduler,
        },
      ],
    }).compile();

    service = module.get<SchedulerService>(SchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isOverlappingJob - Exact Day Match overlapping', () => {
    it('should return true', async function () {
      const result = {
        isOverlapping: true,
        _id: '60f0b0b3e6b0b1a0e8e0b1a0',
      };

      jest
        .spyOn(service, 'isOverlappingJob')
        .mockImplementation(async () => result)
      const mock: CreateSchedulerDto = {
        dayOfWeek: [DayOfWeek.Monday, DayOfWeek.Tuesday],
        startTime: '07:15',
        endTime: '07:30',
      };
      expect(await service.isOverlappingJob(mock)).toBe(result);
    });
  });

  describe('isOverlappingJob - Exact Day Match non overlapping', () => {
    it('should return true', async function () {
      const result = {
        isOverlapping: false,
        _id: '60f0b0b3e6b0b1a0e8e0b1a0',
      };

      jest
        .spyOn(service, 'isOverlappingJob')
        .mockImplementation(async () => result);
      const mock: CreateSchedulerDto = {
        dayOfWeek: [DayOfWeek.Monday, DayOfWeek.Tuesday],
        startTime: '07:45',
        endTime: '07:50',
      };
      expect(await service.isOverlappingJob(mock)).toBe(result);
    });
  });

  describe('isOverlappingJob - Exact One Day Match overlapping', () => {
    it('should return true', async function () {
      const result = {
        isOverlapping: true,
        _id: '60f0b0b3e6b0b1a0e8e0b1a0',
      };

      jest
        .spyOn(service, 'isOverlappingJob')
        .mockImplementation(async () => result);
      const mock: CreateSchedulerDto = {
        dayOfWeek: [DayOfWeek.Monday],
        startTime: '07:15',
        endTime: '07:30',
      };
      expect(await service.isOverlappingJob(mock)).toBe(result);
    });
  });

  describe('isOverlappingJob - Exact One Day Match non overlapping', () => {
    it('should return true', async function () {
      const result = {
        isOverlapping: false,
        _id: '60f0b0b3e6b0b1a0e8e0b1a0',
      };
      jest
        .spyOn(service, 'isOverlappingJob')
        .mockImplementation(async () => result);
      const mock: CreateSchedulerDto = {
        dayOfWeek: [DayOfWeek.Monday],
        startTime: '07:45',
        endTime: '07:50',
      };
      expect(await service.isOverlappingJob(mock)).toBe(result);
    });
  });

  describe('isOverlappingJob - Exact One other Day Match overlapping', () => {
    it('should return true', async function () {
      const result = {
        isOverlapping: true,
        _id: '60f0b0b3e6b0b1a0e8e0b1a0',
      };

      jest
        .spyOn(service, 'isOverlappingJob')
        .mockImplementation(async () => result);
      const mock: CreateSchedulerDto = {
        dayOfWeek: [DayOfWeek.Tuesday],
        startTime: '07:15',
        endTime: '07:30',
      };
      expect(await service.isOverlappingJob(mock)).toBe(result);
    });
  });

  describe('isOverlappingJob - Exact One other Day Match non overlapping', () => {
    it('should return true', async function () {
      const result = {
        isOverlapping: false,
        _id: '60f0b0b3e6b0b1a0e8e0b1a0',
      };
      jest
        .spyOn(service, 'isOverlappingJob')
        .mockImplementation(async () => result);
      const mock: CreateSchedulerDto = {
        dayOfWeek: [DayOfWeek.Tuesday],
        startTime: '07:45',
        endTime: '07:50',
      };
      expect(await service.isOverlappingJob(mock)).toBe(result);
    });
  });

  describe('isOverlappingJob - Other Day Exact Time Match non overlapping', () => {
    it('should return true', async function () {
      const result = {
        isOverlapping: false,
        _id: '60f0b0b3e6b0b1a0e8e0b1a0',
      };
      jest
        .spyOn(service, 'isOverlappingJob')
        .mockImplementation(async () => result);
      const mock: CreateSchedulerDto = {
        dayOfWeek: [DayOfWeek.Friday],
        startTime: '07:15',
        endTime: '07:30',
      };
      expect(await service.isOverlappingJob(mock)).toBe(result);
    });
  });

  describe('isOverlappingJob - Exacts days Match different time overlapping', () => {
    it('should return true', async function () {
      const result = {
        isOverlapping: true,
        _id: '60f0b0b3e6b0b1a0e8e0b1a0',
      };

      jest
        .spyOn(service, 'isOverlappingJob')
        .mockImplementation(async () => result);
      const mock: CreateSchedulerDto = {
        dayOfWeek: [DayOfWeek.Monday, DayOfWeek.Tuesday],
        startTime: '07:29',
        endTime: '07:35',
      };
      expect(await service.isOverlappingJob(mock)).toBe(result);
    });
  });

  describe('isOverlappingJob - Exacts one day Match different time overlapping', () => {
    it('should return true', async function () {
      const result = {
        isOverlapping: true,
        _id: '60f0b0b3e6b0b1a0e8e0b1a0',
      };

      jest
        .spyOn(service, 'isOverlappingJob')
        .mockImplementation(async () => result);
      const mock: CreateSchedulerDto = {
        dayOfWeek: [DayOfWeek.Monday],
        startTime: '07:29',
        endTime: '07:35',
      };
      expect(await service.isOverlappingJob(mock)).toBe(result);
    });
  });

  describe('isOverlappingJob - Exacts one other day Match different time overlapping', () => {
    it('should return true', async function () {
      const result = {
        isOverlapping: true,
        _id: '60f0b0b3e6b0b1a0e8e0b1a0',
      };

      jest
        .spyOn(service, 'isOverlappingJob')
        .mockImplementation(async () => result);
      const mock: CreateSchedulerDto = {
        dayOfWeek: [DayOfWeek.Tuesday],
        startTime: '07:29',
        endTime: '07:35',
      };
      expect(await service.isOverlappingJob(mock)).toBe(result);
    });
  });

  describe('isOverlappingJob - No Day Match non overlapping', () => {
    it('should return true', async function () {
      const result = {
        isOverlapping: false,
        _id: '60f0b0b3e6b0b1a0e8e0b1a0',
      };

      jest
        .spyOn(service, 'isOverlappingJob')
        .mockImplementation(async () => result);
      const mock: CreateSchedulerDto = {
        dayOfWeek: [DayOfWeek.Wednesday],
        startTime: '07:29',
        endTime: '07:35',
      };
      expect(await service.isOverlappingJob(mock)).toBe(result);
    });
  });

  describe('isOverlappingJob - Start Time is Greater than End Time overlapping', () => {
    it('should return true', async function () {
      const result = {
        isOverlapping: true,
        _id: '60f0b0b3e6b0b1a0e8e0b1a0',
      };

      jest
        .spyOn(service, 'isOverlappingJob')
        .mockImplementation(async () => result);
      const mock: CreateSchedulerDto = {
        dayOfWeek: [DayOfWeek.Monday],
        startTime: '07:30',
        endTime: '07:15',
      };
      expect(await service.isOverlappingJob(mock)).toBe(result);
    });
  });
});
