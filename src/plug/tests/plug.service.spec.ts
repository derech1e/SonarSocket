import { Test } from "@nestjs/testing";
import { PlugService } from "../plug.service";
import { HttpModule } from "@nestjs/axios";
describe("PlugService", () => {
  let service: PlugService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [PlugService]
    }).compile();

    service = await moduleRef.resolve(PlugService);
  });

  it("PlugService - should be defined", () => {
    expect(service).toBeDefined();
  });
});