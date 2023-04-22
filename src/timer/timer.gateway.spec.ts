import { Test, TestingModule } from '@nestjs/testing';
import { TimerGateway } from './timer.gateway';
import { TimerService } from './timer.service';

describe('TimerGateway', () => {
  let gateway: TimerGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimerGateway, TimerService],
    }).compile();

    gateway = module.get<TimerGateway>(TimerGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
