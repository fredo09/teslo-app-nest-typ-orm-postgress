import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

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
	[id: string]: {
		socket: Socket,
		user: User
	};
}

@Injectable()
export class MessageWsService {
	private connectedClients: ConnectedClients = {};

	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}

	/**
	 * Registers a client as connected
	 * @param client {Socket}
	 */
	async registerClient(client: Socket, userId: string) {
		const user = await this.userRepository.findOneBy({ id: userId });

		if (!user) throw new Error('User not found');
		if (!user.isActive) throw new Error('User is not active');
		
		this.connectedClients[client.id] = {
			socket: client,
			user
		};
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

	/**
	 * returns the full name of the user associated with a client ID
	 * @param clientId string
	 * @returns string
	 */
	getUserFullName(clientId: string): string {
		return this.connectedClients[clientId]?.user.fullName || 'Unknown';
	}
}
