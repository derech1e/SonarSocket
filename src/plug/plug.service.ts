import { Inject, Injectable, Logger } from "@nestjs/common";
import { UpdatePlugDto } from "./dto/update-plug.dto";
import { catchError, firstValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { PlugState } from "./interface/PlugState";
import {
  ISensorService,
  SENSOR_SERVICE,
} from "../sensor/interface/ISensorService";
import { LogsService } from "../logs/logs.service";
import { Action, LogTyp, Module } from "../logs/entities/log.entity";

@Injectable()
export class PlugService {
  private readonly logger = new Logger(PlugService.name);
  private readonly URL = `http://192.168.200.100/cm?cmnd=`;

  constructor(
    private readonly httpService: HttpService,
    @Inject(SENSOR_SERVICE)
    private readonly sensorService: ISensorService,
    @Inject(LogsService)
    private readonly _logsService: LogsService,
  ) {}

  async updatePlugStatus(updatePlugDto: UpdatePlugDto): Promise<PlugState> {
    if (updatePlugDto.POWER1) {
      const isMinDistance = await this.sensorService.isMinDistanceReached();
      console.log("isMinDistance", isMinDistance);
      if (isMinDistance) {
        throw "Min distance reached!";
      }
    }

    const { data } = await firstValueFrom(
      this.httpService.get(this.URL + `Power%20${updatePlugDto.POWER1}`).pipe(
        catchError(async (error) => {
          this.logger.error(error.response.data);
          await this._logsService.log(
            Module.PLUG,
            updatePlugDto.POWER1 === "ON"
              ? Action.ENABLE_PLUG
              : Action.DISABLE_PLUG,
            LogTyp.ERROR,
            error.response.data,
          );
          throw "An error happened!";
        }),
      ),
    );
    await this._logsService.log(
      Module.PLUG,
      updatePlugDto.POWER1 === "ON" ? Action.ENABLE_PLUG : Action.DISABLE_PLUG,
    );
    return data;
  }

  async updateShutdownFailSafe(
    enabled = false,
    endTime = "00:00",
    action: "0" | "1" | "2" = "2",
  ) {
    const urlEncoded: string = encodeURIComponent(
      `Timer1 {"Enable":${
        enabled ? "1" : "0"
      },"Mode":0,"Time":"${endTime}","Window":0,"Days":"11TW11S","Repeat":0,"Output":1,"Action":${action}}`,
    );
    const { data } = await firstValueFrom(
      this.httpService.get(this.URL + urlEncoded).pipe(
        catchError(async (error) => {
          this.logger.error(error.response.data);
          await this._logsService.log(
            Module.PLUG,
            Action.UPDATE_PLUG_FAILSAFE,
            LogTyp.ERROR,
            error.response.data,
          );
          throw "An error happened!";
        }),
      ),
    );
    await this._logsService.log(
      Module.PLUG,
      Action.UPDATE_PLUG_FAILSAFE,
      LogTyp.INFO,
      urlEncoded,
    );
    return data;
  }

  async getPlugState(): Promise<PlugState> {
    const url = `http://192.168.200.100/cm?cmnd=Power`;
    const { data } = await firstValueFrom(
      this.httpService.get<PlugState>(url).pipe(
        catchError((error) => {
          this.logger.error(error.response.data);
          this._logsService.log(
            Module.PLUG,
            Action.REQUEST_PLUG_STATUS,
            LogTyp.ERROR,
            error.response.data,
          );
          throw "An error happened!";
        }),
      ),
    );
    await this._logsService.log(
      Module.PLUG,
      Action.REQUEST_PLUG_STATUS,
      LogTyp.INFO,
      data.POWER1,
    );
    return data;
  }
}
