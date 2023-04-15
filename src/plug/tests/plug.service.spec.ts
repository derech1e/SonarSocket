import { Test } from "@nestjs/testing";
import { PlugService } from "../plug.service";
describe("PlugService", () => {
  let service: PlugService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PlugService]
    }).compile();

    service = await moduleRef.resolve(PlugService);
  });

  it("PlugService - should be defined", () => {
    expect(service).toBeDefined();
  });
});