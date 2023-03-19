import {Injectable} from "@nestjs/common";

const Gpio = require('onoff').Gpio;

@Injectable()
export class SocketService {

    // Sonar Sensor config
    US_SENSOR_TRIGGER = new Gpio(23, 'out');
    US_SENSOR_ECHO = new Gpio(24, 'in', 'both');

    maxDelay = 1; // in sec
    triggerDelay = 0.00001; // in sec
    measurementFactor = (343460 / 2); // SoundSpeed / 2 (round trip) in mm/s
    // https://de.wikipedia.org/wiki/Schallgeschwindigkeit
    // +20°C 343,46m/s
    // 0°C 331,50m/s
    // −20°C 319,09m/s


    async retrieveGpioData(): Promise<{ distance: number, start_time: number, stop_time: number, max_time: number, time_diff: number }> {
        // Set TRIGGER for min 0.01ms
        await this.US_SENSOR_TRIGGER.write(1);
        await new Promise(resolve => setTimeout(resolve, this.triggerDelay * 1000));
        await this.US_SENSOR_TRIGGER.write(0);

        // save start_time
        let start_time = Date.now();
        const max_time = start_time + this.maxDelay * 1000;

        // wait rising flank from ECHO
        while (start_time < max_time && await this.US_SENSOR_ECHO.read() === 0) {
            start_time = Date.now();
        }

        // save stop_time
        let stop_time = start_time;
        // wait for falling flank from ECHO
        while (stop_time < max_time && await this.US_SENSOR_ECHO.read() === 1) {
            stop_time = Date.now();
        }

        if (stop_time < max_time) {
            // calculate time diff between start and stop in seconds
            const time_diff = (stop_time - start_time) / 1000;
            // calculate distance
            const distance = (time_diff * this.measurementFactor) / 10;
            return {distance, start_time, stop_time, max_time, time_diff};
        } else {
            return {distance: -1, start_time, stop_time, max_time, time_diff: 0};
        }
    }
}