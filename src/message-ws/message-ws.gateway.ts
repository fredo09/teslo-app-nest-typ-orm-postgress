import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageWsService } from './message-ws.service';
import { NewMessageDto } from './dtos';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadI } from 'src/auth/interfaces';

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
    private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * Handles the connection of a client
   * @param client {Socket}
   */
  async handleConnection(client: Socket) {
    let payload: JwtPayloadI;
    const tokenJwt = client.handshake.headers.authentication as string;
    try {
      const { id } = this.jwtService.verify(tokenJwt);
      await this.messageWsService.registerClient(client, id);
    }catch (error) {
      //! si el token no es valido, desconectamos al cliente
      client.disconnect();
      return;
    }
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

  /**
   * This is a message handler that listens for the 'message-from-client' event.
   * When this event is received, it emits a 'message-from-server' event to all connected clients.
   * The emitted message includes the full name of the user who sent the message and the message itself.
   * 
   * @param client {Socket} - The client that sent the message.
   * @param payload {NewMessageDto} - The message data sent by the client.
   */
  @SubscribeMessage('message-from-client')
  async handleOnMessageFromClient( client: Socket, payload: NewMessageDto ) {
    //!Emitir al cliente conectado
    // client.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message || 'no-message'
    // });

    //!Emitir a todos los clientes conectados menos al conectado
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message || 'no-message'
    // });

    //!Emitir a todos los clientes conectados
    this.wss.emit('message-from-server', {
      fullName: this.messageWsService.getUserFullName(client.id),
      message: payload.message || 'es un mensaje vacio'
    });
  }
}
