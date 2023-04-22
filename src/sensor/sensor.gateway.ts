import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";
import { SensorService } from "./sensor.service";

@WebSocketGateway({
  cors: {
    origin: "*"
  },
  namespace: "sonar"
})
export class SensorGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;
  private readonly ROOM_NAME = "distance";
  private readonly MEASURE_TIME = 100;
  private readonly logger: Logger = new Logger("ChatGateway");

  private userCount = 0;
  private interValId: any = null;

  constructor(private readonly socketService: SensorService) {
  }

  afterInit(server: any) {
    this.logger.log("Sensor Ready!");
  }

  startInterval = () => {
    this.interValId = setInterval(async () => {
      this.server.in(this.ROOM_NAME).emit(this.ROOM_NAME, await this.socketService.measureDistance(this.MEASURE_TIME));
    }, this.MEASURE_TIME);
  };

  stopInterval = () => {
    clearInterval(this.interValId);
    this.interValId = null;
  };

  checkForInterval = () => {
    if (this.userCount > 0 && this.interValId == null) {
      this.startInterval();
      this.logger.log("Started Interval!");
    } else if (this.userCount <= 0) {
      this.stopInterval();
      this.logger.log("Stopped Interval!");
    }
  };

  handleConnection(@ConnectedSocket() client: Socket) {
    client.join(this.ROOM_NAME);
    this.userCount++;
    this.checkForInterval();
  }

  handleDisconnect(@ConnectedSocket() client: any): any {
    client.leave(this.ROOM_NAME);
    this.userCount--;
    this.checkForInterval();
  }

  @SubscribeMessage("rejoin")
  handleMessage(client: Socket) {
    client.leave(this.ROOM_NAME);
    this.userCount--;
    this.server.emit(this.ROOM_NAME, "Requested Rejoin!");
    client.join(this.ROOM_NAME);
    this.userCount++;
    this.checkForInterval();
  }
}