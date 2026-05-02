import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

/**
 * ConnectedClients interface
 * This interface defines the structure of the connected clients object.
 * It uses the client ID as the key and the Socket object as the value.
 * 
 * @author @alfredVazquez
 * @version 1.0.02
 * @see https://socket.io/docs/v4/server-socket-instance/
 */
interface ConnectedClients {
	[id: string]: Socket;
}

@Injectable()
export class MessageWsService {
	private connectedClients: ConnectedClients = {};

	/**
	 * Registers a client as connected
	 * @param client {Socket}
	 */
	registerClient(client: Socket) {
		this.connectedClients[client.id] = client;
	}

	/**
	 * Removes a client from the list of connected clients
	 * @param clientId {string}
	 */
	removeClient(clientId: string) {
		delete this.connectedClients[clientId];
	}

	/**
	 * Returns the list of connected clients
	 * @returns {string[]}
	 */
	getConnectedClients(): string[] {
		return Object.keys(this.connectedClients);
	}
}
