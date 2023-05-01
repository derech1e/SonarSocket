import { Injectable, Logger } from '@nestjs/common';
import { UpdatePlugDto } from './dto/update-plug.dto';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { PlugState } from './interface/PlugState';

@Injectable()
export class PlugService {
  private readonly logger = new Logger(PlugService.name);

  constructor(private readonly httpService: HttpService) {}

  async updatePlugStatus(updatePlugDto: UpdatePlugDto): Promise<PlugState> {
    const url = `http://192.168.200.196/cm?cmnd=Power%20${updatePlugDto.POWER1}`;
    const { data } = await firstValueFrom(
      this.httpService.get(url).pipe(
        catchError((error) => {
          this.logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );
    return data;
  }

  async getPlugState(): Promise<PlugState> {
    const url = `http://192.168.200.196/cm?cmnd=Power`;
    const { data } = await firstValueFrom(
      this.httpService.get<PlugState>(url).pipe(
        catchError((error) => {
          this.logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );
    return data;
  }
}
