import { Server, Socket } from 'socket.io';
import { MessageWsService } from './message-ws.service';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';

/**
 * Message WebSocket Gateway
 * This gateway handles WebSocket connections for messaging functionality.
 * It allows clients to connect and disconnect, and keeps track of connected clients.
 * It also emits updates to all clients when the number of connected clients changes.
 * 
 * @author @alfredVazquez
 * @version 1.0.0
 * @see https://docs.nestjs.com/websockets/gateways
 * @see https://socket.io/docs/v4/
 */
@WebSocketGateway({ cors: true })
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss!: Server;
  
  constructor(
    private readonly messageWsService: MessageWsService
  ) {}

  /**
   * Handles the connection of a client
   * @param client {Socket}
   */
  handleConnection(client: Socket) {
    this.messageWsService.registerClient(client);
    console.log("🚀 ~ Clientes conectados : ", {
      CountClients: this.handleClientsConnected() 
    });
    this.wss.emit('clients-updated', this.handleClientsConnected());
  }

  /**
   * Handles the disconnection of a client
   * @param client {Socket}
   */
  handleDisconnect({ id }: Socket) {
    this.messageWsService.removeClient(id);
  }

  /**
   * returns the list of connected clients
   * @returns 
   */
  handleClientsConnected() {
    return this.messageWsService.getConnectedClients();
  }
}
