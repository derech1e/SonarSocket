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
    userTimers: any = {};
    private logger: Logger = new Logger('ChatGateway');

    startTimerForId = (id: string, room: string) => {
        (this.userTimers)[id] = setInterval(async () => {
            // this.server.in(room).emit('time', {time: new Date().toJSON()});
            this.server.in(room).emit('time', await this.socketService.retrieveGpioData());
        }, 100);
    }

    stopTimerForId = (id: string) => {
        clearInterval(this.userTimers[id])
        delete this.userTimers[id];
    }

    handleConnection(@ConnectedSocket() client: Socket) {
        client.join('time');
        this.startTimerForId(client.id, 'time');
    }

    handleDisconnect(@ConnectedSocket() client: any): any {
        client.leave('time');
        this.stopTimerForId(client.id);
    }

    afterInit(server: any) {
        this.logger.log('Setup Gateway to sensor!');
    }

    @SubscribeMessage('rejoin')
    handleMessage(client: Socket) {
        client.leave("time")
        this.server.emit("time", "Requested Rejoin!")
        client.join("time")
        this.stopTimerForId(client.id);
        this.startTimerForId(client.id, 'time');
    }
}