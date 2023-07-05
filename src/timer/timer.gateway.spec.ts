import { Test, TestingModule } from "@nestjs/testing";
import { TimerGateway } from "./timer.gateway";
import { TimerService } from "./timer.service";
import { PlugService } from "../plug/plug.service";
import { HttpModule } from "@nestjs/axios";

describe("TimerGateway", () => {
  let gateway: TimerGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimerGateway, TimerService, PlugService],
      imports: [HttpModule]
    }).compile();

    gateway = module.get<TimerGateway>(TimerGateway);
  });

  it("should be defined", () => {
    expect(gateway).toBeDefined();
  });
});
