import { Socket } from 'socket.io';
import { MessageWsService } from './message-ws.service';
import { OnGatewayConnection, OnGatewayDisconnect , WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({ cors: true })
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly messageWsService: MessageWsService
  ) {}

  handleConnection(client: Socket) {
    this.messageWsService.registerClient(client);
    console.log("🚀 ~ Clientes conectados : ", {
      CountClients: this.handleClientsConnected() 
    });
  }

  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client.id);
  }

  handleClientsConnected() {
    return this.messageWsService.getConnectedClients();
  }
}
