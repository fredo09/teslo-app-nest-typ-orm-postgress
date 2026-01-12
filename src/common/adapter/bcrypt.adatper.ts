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

	/**
	 * Genera un hash para la contraseña proporcionada
	 * @param password la contraseña a hashear
	 * @param saltRounds el número de rondas de sal (opcional, por defecto es 10)
	 * @returns el hash de la contraseña
	 */
	hashSync(password: string, saltRounds: number = 10): string {
		return this.bcrypt.hashSync(password, saltRounds);
	}

	/**
	 * Compara una contraseña en texto plano con un hash
	 * @param password la contraseña a comparar
	 * @param hash el hash contra el que se va a comparar
	 * @returns true si las contraseñas coinciden, false en caso contrario
	 */
	compareSync(password: string, hash: string): boolean {
		return this.bcrypt.compareSync(password, hash);
	}
}