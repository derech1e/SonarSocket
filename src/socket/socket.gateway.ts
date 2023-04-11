import {
    ConnectedSocket, OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import {Server, Socket} from "socket.io";
import {Inject, Logger} from "@nestjs/common";
import {SocketService} from "./socket.service";

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: 'chat',
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(private readonly socketService: SocketService) {}

    @WebSocketServer()
    server: Server;
    ROOM_NAME = 'time';
    userCount = 0;
    interValId: any = null;
    private logger: Logger = new Logger('ChatGateway');

    startInterval = () => {
        this.interValId = setInterval(async () => {
            this.socketService.getDistance(this.userCount, this.server, this.ROOM_NAME);
        }, 1000);
    }
    checkForInterval = () => {
        if(this.userCount > 0) {
            if(this.interValId == null) {
                this.startInterval();
                this.logger.log("Started Interval!")
            }
            this.logger.warn("Unexpected Interval >>Start<< Request!")
        } else {
            if(this.interValId != null) {
                this.stopInterval();
                this.logger.log("Stopped Interval!")
            }
            this.logger.warn("Unexpected Interval >>Stop<< Request!")
        }
    }

    stopInterval = () => {
        clearInterval(this.interValId);
        this.interValId = null;
    }

    handleConnection(@ConnectedSocket() client: Socket) {
        client.join('time');
        this.userCount++;
        this.checkForInterval();
    }

    handleDisconnect(@ConnectedSocket() client: any): any {
        client.leave('time');
        this.userCount--;
        this.checkForInterval();
    }

    afterInit(server: any) {
        this.logger.log('Prepare Sensor...');
        this.socketService.setupListener(server, this.ROOM_NAME);
        this.logger.log("Sensor Ready!");
    }

    @SubscribeMessage('rejoin')
    handleMessage(client: Socket) {
        client.leave("time")
        this.server.emit("time", "Requested Rejoin!")
        client.join("time")
    }
}