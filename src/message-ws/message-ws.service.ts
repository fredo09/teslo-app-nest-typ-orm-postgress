import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

interface ConnectedClients {
	[id: string]: Socket;
}

@Injectable()
export class MessageWsService {
	private connectedClients: ConnectedClients = {};

	registerClient(client: Socket) {
		this.connectedClients[client.id] = client;
	}

	removeClient(clientId: string) {
		delete this.connectedClients[clientId];
	}

	getConnectedClients(): number {
		return Object.keys(this.connectedClients).length;
	}
}
