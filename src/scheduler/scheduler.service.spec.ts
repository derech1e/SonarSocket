import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerService } from './scheduler.service';
import { CreateSchedulerDto, DayOfWeek } from "./dto/create-scheduler.dto";

describe('SchedulerService', () => {
  let service: SchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchedulerService],
    }).compile();

    service = module.get<SchedulerService>(SchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe("isOverlappingJob - Exact Day Match overlapping", () => {
    it("should return true", function() {
      const result = true;

      jest.spyOn(service, "isOverlappingJob").mockImplementation(() => result);
      const mock: CreateSchedulerDto = {
        dayOfWeek: [
          DayOfWeek.Monday,
          DayOfWeek.Tuesday
        ],
        startTime: "07:15",
        endTime: "07:30"
      };
      expect(service.isOverlappingJob(mock)).toBe(result);

    });
  });

  describe("isOverlappingJob - Exact Day Match non overlapping", () => {
    it("should return true", function() {
      const result = false;

      jest.spyOn(service, "isOverlappingJob").mockImplementation(() => result);
      const mock: CreateSchedulerDto = {
        dayOfWeek: [
          DayOfWeek.Monday,
          DayOfWeek.Tuesday
        ],
        startTime: "07:45",
        endTime: "07:50"
      };
      expect(service.isOverlappingJob(mock)).toBe(result);

    });
  });

  describe("isOverlappingJob - Exact One Day Match overlapping", () => {
    it("should return true", function() {
      const result = true;

      jest.spyOn(service, "isOverlappingJob").mockImplementation(() => result);
      const mock: CreateSchedulerDto = {
        dayOfWeek: [
          DayOfWeek.Monday,
        ],
        startTime: "07:15",
        endTime: "07:30"
      };
      expect(service.isOverlappingJob(mock)).toBe(result);

    });
  });

  describe("isOverlappingJob - Exact One Day Match non overlapping", () => {
    it("should return true", function() {
      const result = false;

      jest.spyOn(service, "isOverlappingJob").mockImplementation(() => result);
      const mock: CreateSchedulerDto = {
        dayOfWeek: [
          DayOfWeek.Monday,
        ],
        startTime: "07:45",
        endTime: "07:50"
      };
      expect(service.isOverlappingJob(mock)).toBe(result);

    });
  });

  describe("isOverlappingJob - Exact One other Day Match overlapping", () => {
    it("should return true", function() {
      const result = true;

      jest.spyOn(service, "isOverlappingJob").mockImplementation(() => result);
      const mock: CreateSchedulerDto = {
        dayOfWeek: [
          DayOfWeek.Tuesday,
        ],
        startTime: "07:15",
        endTime: "07:30"
      };
      expect(service.isOverlappingJob(mock)).toBe(result);

    });
  });

  describe("isOverlappingJob - Exact One other Day Match non overlapping", () => {
    it("should return true", function() {
      const result = false;

      jest.spyOn(service, "isOverlappingJob").mockImplementation(() => result);
      const mock: CreateSchedulerDto = {
        dayOfWeek: [
          DayOfWeek.Tuesday,
        ],
        startTime: "07:45",
        endTime: "07:50"
      };
      expect(service.isOverlappingJob(mock)).toBe(result);

    });
  });

  describe("isOverlappingJob - Other Day Exact Time Match non overlapping", () => {
    it("should return true", function() {
      const result = false;

      jest.spyOn(service, "isOverlappingJob").mockImplementation(() => result);
      const mock: CreateSchedulerDto = {
        dayOfWeek: [
          DayOfWeek.Friday,
        ],
        startTime: "07:15",
        endTime: "07:30"
      };
      expect(service.isOverlappingJob(mock)).toBe(result);

    });
  });

  describe("isOverlappingJob - Exacts days Match different time overlapping", () => {
    it("should return true", function() {
      const result = true;

      jest.spyOn(service, "isOverlappingJob").mockImplementation(() => result);
      const mock: CreateSchedulerDto = {
        dayOfWeek: [
          DayOfWeek.Monday,
          DayOfWeek.Tuesday
        ],
        startTime: "07:29",
        endTime: "07:35"
      };
      expect(service.isOverlappingJob(mock)).toBe(result);

    });
  });

  describe("isOverlappingJob - Exacts one day Match different time overlapping", () => {
    it("should return true", function() {
      const result = true;

      jest.spyOn(service, "isOverlappingJob").mockImplementation(() => result);
      const mock: CreateSchedulerDto = {
        dayOfWeek: [
          DayOfWeek.Monday,
        ],
        startTime: "07:29",
        endTime: "07:35"
      };
      expect(service.isOverlappingJob(mock)).toBe(result);

    });
  });

  describe("isOverlappingJob - Exacts one other day Match different time overlapping", () => {
    it("should return true", function() {
      const result = true;

      jest.spyOn(service, "isOverlappingJob").mockImplementation(() => result);
      const mock: CreateSchedulerDto = {
        dayOfWeek: [
          DayOfWeek.Tuesday,
        ],
        startTime: "07:29",
        endTime: "07:35"
      };
      expect(service.isOverlappingJob(mock)).toBe(result);

    });
  });

  describe("isOverlappingJob - No Day Match non overlapping", () => {
    it("should return true", function() {
      const result = false;

      jest.spyOn(service, "isOverlappingJob").mockImplementation(() => result);
      const mock: CreateSchedulerDto = {
        dayOfWeek: [
          DayOfWeek.Wednesday,
        ],
        startTime: "07:29",
        endTime: "07:35"
      };
      expect(service.isOverlappingJob(mock)).toBe(result);
    });
  });

  describe("isOverlappingJob - Start Time is Greater than End Time overlapping", () => {
    it("should return true", function() {
      const result = true;

      jest.spyOn(service, "isOverlappingJob").mockImplementation(() => result);
      const mock: CreateSchedulerDto = {
        dayOfWeek: [
          DayOfWeek.Monday,
        ],
        startTime: "07:30",
        endTime: "07:15"
      };
      expect(service.isOverlappingJob(mock)).toBe(result);
    });
  });
  
});
