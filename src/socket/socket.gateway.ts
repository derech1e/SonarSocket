import {
  ConnectedSocket, OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";
import { SocketService } from "./socket.service";

@WebSocketGateway({
  cors: {
    origin: "*"
  },
  namespace: "sonar"
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;
  ROOM_NAME = "time";
  userCount = 0;
  MEASURE_TIME = 100;
  interValId: any = null;
  private logger: Logger = new Logger("ChatGateway");

  constructor(private readonly socketService: SocketService) {
  }

  startInterval = () => {
    this.interValId = setInterval(async () => {
      this.server.in(this.ROOM_NAME).emit("time", await this.socketService.measureDistance(this.MEASURE_TIME));
    }, this.MEASURE_TIME);
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

  stopInterval = () => {
    clearInterval(this.interValId);
    this.interValId = null;
  };

  handleConnection(@ConnectedSocket() client: Socket) {
    client.join("time");
    this.userCount++;
    this.checkForInterval();
  }

  handleDisconnect(@ConnectedSocket() client: any): any {
    client.leave("time");
    this.userCount--;
    this.checkForInterval();
  }

  afterInit(server: any) {
    this.logger.log("Sensor Ready!");
  }

  @SubscribeMessage("rejoin")
  handleMessage(client: Socket) {
    client.leave("time");
    this.userCount--;
    this.server.emit("time", "Requested Rejoin!");
    client.join("time");
    this.userCount++;
    this.checkForInterval();
  }
}