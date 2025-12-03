import { Repository } from "typeorm";
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";

import { User } from "../entities/user.entity";

import { JwtPayloadI } from "../interfaces/jwt-payload.interface";

/**
 * Estrategia JWT para la autenticación de usuarios
 * Extiende la estrategia PassportStrategy utilizando la estrategia JWT de Passport
 * Implementa el método validate para validar el token JWT y extraer la carga útil
 * @author Alfredo Vázquez
 * @version 1.0.0
 */
@Injectable() //* -> todo strategy debe ser inyectable para hacer relacion con algun modulo
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		configService: ConfigService
	) {
		/**
		 *  Configuramos la estrategia JWT, pasando las opciones necesarias a el constructor de la superclase
		 * @param secretOrKey clave secreta para firmar y verificar los tokens JWT
		 * @param jwtFromRequest función para extraer el token JWT de la solicitud entrante
		 */
		super({
			secretOrKey: configService?.get<string>('JWT_SECRET') || 'defaultSecretKey',
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		});
	}

	/**
	 * Método para validar el token JWT y extraer la carga útil
	 * @param payload carga útil del token JWT
	 * @returns usuario encontrado o excepción si no es válido
	 */
	async validate(payload: JwtPayloadI): Promise<User> {
		const { email } = payload;
		const user = await this.userRepository.findOneBy({ email });

		if (!user) {
			throw new UnauthorizedException('Token not valid');
		}

		if (!user.isActive) {
			throw new UnauthorizedException('User is inactive');
		}

		return user;
	}
}