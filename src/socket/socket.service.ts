import { Injectable } from "@nestjs/common";
import { Gpio } from "pigpio";

@Injectable()
export class SocketService {
  private readonly TRIGGER_GPIO: number = 23;
  private readonly ECHO_GPIO : number= 24;
  private readonly SOUND_SPEED_CM_PER_SEC: number = 34300; // Speed of sound in cm/s 34000 => 15°C | 3313 => 0°C

  async measureDistance(timeout: number): Promise<{
    status: "SUCCESS" | "TIMEOUT" | "TOO_FAR_AWAY",
    time: Date,
    distance: number,
    sensor: { triggerTick: number, echoTick: number, diff: number }
  }> {
    const trigger = new Gpio(this.TRIGGER_GPIO, { mode: Gpio.OUTPUT });
    const echo = new Gpio(this.ECHO_GPIO, { mode: Gpio.INPUT, alert: true });

    return new Promise((resolve) => {
      let startTick: number;
      let timeoutId: NodeJS.Timeout;
      echo.on("alert", (level: number, tick: number) => {
        if (level === 1) {
          startTick = tick;
        } else {
          const diff = (tick >> 0) - (startTick >> 0); // Unsigned 32-bit arithmetic
          const duration = diff / 1000000; // Convert to seconds
          const distance = (duration * this.SOUND_SPEED_CM_PER_SEC) / 2; // Distance = speed * time / 2
          clearTimeout(timeoutId);
          if (distance < 1190) {
            resolve({
              status: "SUCCESS",
              time: new Date(),
              distance,
              sensor: { triggerTick: startTick, echoTick: tick, diff }
            });
          }
          // } else {
          //   resolve({
          //     status: "TOO_FAR_AWAY",
          //     time: new Date(),
          //     distance,
          //     sensor: { triggerTick: startTick, echoTick: tick, diff }
          //   });
          // }
        }
      });
      trigger.trigger(10, 1); // Send 10us trigger pulse
      timeoutId = setTimeout(() => {
        echo.removeAllListeners("alert");
        resolve({ status: "TIMEOUT", time: new Date(), distance: null, sensor: null });
      }, timeout);
    });
  }
}