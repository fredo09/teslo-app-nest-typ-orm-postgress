import { Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";

import { User } from "../entities/user.entity";

import { JwtPayloadI } from "../interfaces/jwt-payload.interface";

/**
 * Estrategia JWT para la autenticación de usuarios
 * Extiende la estrategia PassportStrategy utilizando la estrategia JWT de Passport
 * Implementa el método validate para validar el token JWT y extraer la carga útil
 * @author Alfredo Vázquez
 * @version 1.0.0
 */
export class JwtStrategy extends PassportStrategy(Strategy) {
	async validate(payload: JwtPayloadI): Promise<User> {

		const { email } = payload;

		return ;
	}
}