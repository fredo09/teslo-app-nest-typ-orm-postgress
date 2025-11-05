import * as bcrypt from 'bcrypt';
import { Injectable } from "@nestjs/common";
import { BcryptAdapterI } from "../interface/bcrypt.interface";

/**
 * Adaptador de Bcrypt
 * Implementa la interfaz BcryptAdapterI para proporcionar funcionalidad de hashing de contraseñas
 * Utiliza la biblioteca bcrypt para realizar el hashing de contraseñas de manera segura
 * @author Alfredo Vázquez
 * @version 1.0.0
 */

@Injectable()
export class BcryptAdapter implements BcryptAdapterI {
	private bcrypt: typeof bcrypt = bcrypt;

	hashSync(password: string, saltRounds: number = 10): string {
		return this.bcrypt.hashSync(password, saltRounds);
	}
}