import { HttpException, HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import * as fs from "fs";
import { DayOfWeek } from "../src/scheduler/dto/create-scheduler.dto";
import { getModelToken } from "@nestjs/mongoose";
import { Scheduler } from "../src/scheduler/entities/scheduler.entity";
import { AppModule } from "../src/app.module";
import { Model } from "mongoose";

describe("Plug", () => {
  let app: INestApplication;
  let schedulerModel: Model<Scheduler>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      transform: true
    }));
    await app.init();
    schedulerModel = moduleRef.get<Model<Scheduler>>(getModelToken(Scheduler.name));
  });

  beforeEach(async () => {
    await schedulerModel.deleteMany().exec();
    await schedulerModel.create({
      dayOfWeek: [
        DayOfWeek.Monday,
        DayOfWeek.Tuesday
      ],
      startTime: "07:15",
      endTime: "07:30"
    });
  });


  it("/scheduler/jobs (GET)", () => {
    return request(app.getHttpServer())
      .get("/scheduler/jobs")
      .expect(HttpStatus.OK)
      .expect(response => {
        expect(response.body).toHaveLength(1);
      })
      /*.expect(response => {
        const { body } = response;
        expect(body).toBe([{
          dayOfWeek: [
            DayOfWeek.Monday,
            DayOfWeek.Tuesday
          ],
          startTime: "07:15",
          endTime: "07:30"
        }]);
      });*/
  });

  it("/scheduler/jobs (POST) Conflict-1", () => {
    return request(app.getHttpServer())
      .post("/scheduler/jobs")
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

  it("/scheduler/jobs (POST) Conflict-2", () => {
    return request(app.getHttpServer())
      .post("/scheduler/jobs")
      .send({
        dayOfWeek: [
          DayOfWeek.Monday
        ],
        startTime: "07:15",
        endTime: "07:30"
      })
      .expect(HttpStatus.CONFLICT);
  });

  it("/scheduler/jobs (POST) Conflict-3", () => {
    return request(app.getHttpServer())
      .post("/scheduler/jobs")
      .send({
        dayOfWeek: [
          DayOfWeek.Tuesday
        ],
        startTime: "07:15",
        endTime: "07:30"
      })
      .expect(HttpStatus.CONFLICT);
  });

  it("/scheduler/jobs (POST) Conflict-4", () => {
    return request(app.getHttpServer())
      .post("/scheduler/jobs")
      .send({
        dayOfWeek: [
          DayOfWeek.Monday
        ],
        startTime: "07:29",
        endTime: "07:45"
      })
      .expect(HttpStatus.CONFLICT);
  });

  it("/scheduler/jobs (POST) Conflict-5", () => {
    return request(app.getHttpServer())
      .post("/scheduler/jobs")
      .send({
        dayOfWeek: [
          DayOfWeek.Tuesday
        ],
        startTime: "07:29",
        endTime: "07:45"
      })
      .expect(HttpStatus.CONFLICT);
  });

  it("/scheduler/jobs (POST) Conflict-6", () => {
    return request(app.getHttpServer())
      .post("/scheduler/jobs")
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

  it("/scheduler/jobs (POST) Successful", () => {
    return request(app.getHttpServer())
      .post("/scheduler/jobs")
      .send({
        dayOfWeek: [
          DayOfWeek.Monday,
          DayOfWeek.Tuesday
        ],
        startTime: "07:45",
        endTime: "07:50"
      })
      .expect(HttpStatus.CREATED)
      .expect(response => {
        expect(response.body).toHaveProperty("startTime", "07:45");
        expect(response.body).toHaveProperty("endTime", "07:50");
        expect(response.body).toHaveProperty("dayOfWeek", [
          DayOfWeek.Monday,
          DayOfWeek.Tuesday
        ]);
      })
      /*.expect([
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
      ]);*/
  });

  afterAll(async () => {
    await app.close();
  });
});