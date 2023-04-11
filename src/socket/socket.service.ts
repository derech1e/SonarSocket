import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";

const Gpio = require("pigpio").Gpio;


@Injectable()
export class SocketService {

  // The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
  MICROSECONDS_PER_CM = 1e6 / 34321;
  MAX_TIME_WITHOUT_MESSAGE = 400; // in milliseconds
  US_SENSOR_TRIGGER = 23;
  US_SENSOR_ECHO = 24;

  trigger = new Gpio(this.US_SENSOR_TRIGGER, { mode: Gpio.OUTPUT, timeout: 400 });
  echo = new Gpio(this.US_SENSOR_ECHO, { mode: Gpio.INPUT, alert: true, timeout: 400 });

  lastTickResponse = 0;

  constructor() {
    this.trigger.digitalWrite(0); // Make sure trigger is low
  }

  setupListener(server: Server, room: string) {
    let startTick;
    this.echo.on("alert", (level, tick) => {
      if (level == 1) {
        startTick = tick;
      } else {
        const diff = (tick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
        // if(diff >= 6940) {
        //   server.in(room).emit("time", {distance: -1, startTick, tick, last: this.lastTickResponse});
        //   this.lastTickResponse = Date.now();
        //   return;
        // }
        server.in(room).emit("time", {distance: diff / 2 / this.MICROSECONDS_PER_CM, startTick, tick, last: this.lastTickResponse});
        this.lastTickResponse = Date.now();
      }
    });
  }

  getDistance(userCount: number, server: Server, room: string) {
    if (userCount > 0) {
      this.trigger.trigger(20, 1); // Set trigger high for 10 microseconds
      setTimeout(() => {
        const now = Date.now();
        const timeSinceLastTick = now - this.lastTickResponse;
        if (timeSinceLastTick >= this.MAX_TIME_WITHOUT_MESSAGE) {
          server.in(room).emit("time", {distance: -1, startTick: -1, tick: -1, last: this.lastTickResponse});
        }
      }, this.MAX_TIME_WITHOUT_MESSAGE);
    }
  }
}