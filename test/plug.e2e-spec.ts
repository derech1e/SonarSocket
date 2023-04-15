import { HttpException, HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { PlugModule } from "../src/plug/plug.module";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import { DayOfWeek } from "../src/plug/dto/CreateSchedulreJobDto";
import * as fs from "fs";

describe("Plug", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [PlugModule]
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      transform: true
    }));
    await app.init();
  });

  it("/plug/scheduler/jobs (GET)", () => {
    return request(app.getHttpServer())
      .get("/plug/scheduler/jobs")
      .expect(HttpStatus.OK)
      .expect([{
        dayOfWeek: [
          DayOfWeek.Monday,
          DayOfWeek.Tuesday
        ],
        startTime: "07:15",
        endTime: "07:30"
      }]);
  });

  it("/plug/scheduler/jobs (POST) Conflict-1", () => {
    return request(app.getHttpServer())
      .post("/plug/scheduler/jobs")
      .send({
        dayOfWeek: [
          DayOfWeek.Monday,
          DayOfWeek.Tuesday
        ],
        startTime: "07:15",
        endTime: "07:30"
      })
      .expect(HttpStatus.CONFLICT);
  });

  it("/plug/scheduler/jobs (POST) Conflict-2", () => {
    return request(app.getHttpServer())
      .post("/plug/scheduler/jobs")
      .send({
        dayOfWeek: [
          DayOfWeek.Monday
        ],
        startTime: "07:15",
        endTime: "07:30"
      })
      .expect(HttpStatus.CONFLICT);
  });

  it("/plug/scheduler/jobs (POST) Conflict-3", () => {
    return request(app.getHttpServer())
      .post("/plug/scheduler/jobs")
      .send({
        dayOfWeek: [
          DayOfWeek.Tuesday
        ],
        startTime: "07:15",
        endTime: "07:30"
      })
      .expect(HttpStatus.CONFLICT);
  });

  it("/plug/scheduler/jobs (POST) Conflict-4", () => {
    return request(app.getHttpServer())
      .post("/plug/scheduler/jobs")
      .send({
        dayOfWeek: [
          DayOfWeek.Monday
        ],
        startTime: "07:29",
        endTime: "07:45"
      })
      .expect(HttpStatus.CONFLICT);
  });

  it("/plug/scheduler/jobs (POST) Conflict-5", () => {
    return request(app.getHttpServer())
      .post("/plug/scheduler/jobs")
      .send({
        dayOfWeek: [
          DayOfWeek.Tuesday
        ],
        startTime: "07:29",
        endTime: "07:45"
      })
      .expect(HttpStatus.CONFLICT);
  });

  it("/plug/scheduler/jobs (POST) Conflict-6", () => {
    return request(app.getHttpServer())
      .post("/plug/scheduler/jobs")
      .send({
        dayOfWeek: [
          DayOfWeek.Monday,
          DayOfWeek.Tuesday
        ],
        startTime: "07:29",
        endTime: "07:45"
      })
      .expect(HttpStatus.CONFLICT);
  });

  it("/plug/scheduler/jobs (POST) Successful", () => {
    return request(app.getHttpServer())
      .post("/plug/scheduler/jobs")
      .send({
        dayOfWeek: [
          DayOfWeek.Monday,
          DayOfWeek.Tuesday
        ],
        startTime: "07:45",
        endTime: "07:50"
      })
      .expect(HttpStatus.CREATED)
      .expect([
        {
          dayOfWeek: [
            DayOfWeek.Monday,
            DayOfWeek.Tuesday
          ],
          startTime: "07:15",
          endTime: "07:30"
        },
        {
          dayOfWeek: [
            DayOfWeek.Monday,
            DayOfWeek.Tuesday
          ],
          startTime: "07:45",
          endTime: "07:50"
        }
      ]);
  });

  afterAll(async () => {
    await app.close();

    // Clear the config file

    const jsonConfig = JSON.stringify(
      [
        {
          "dayOfWeek": [
            "Monday",
            "Tuesday"
          ],
          "startTime": "07:15",
          "endTime": "07:30"
        }
      ], null, 2);

    fs.writeFile("./plug-config.json", jsonConfig, "utf8", (err) => {
      if (err) {
        throw new HttpException("Could not save the new job", HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });
});