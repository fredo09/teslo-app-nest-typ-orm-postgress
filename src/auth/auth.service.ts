import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { CreateUserDto } from './dto/user.dto';

import { User } from './entities/user.entity';

/**
 * Servicio de autenticación
 * Maneja la lógica de negocio relacionada con la autenticación de usuarios
 * Utiliza el repositorio de usuarios para interactuar con la base de datos
 * Proporciona métodos para crear nuevos usuarios
 * Incorpora manejo de excepciones para errores comunes
 * @author Alfredo Vázquez
 * @version 1.0.0
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User) //! ->ser ocupa para un repositorio de TypeORM y entity User
    private readonly userRepository: Repository<User>
  ) {}

  /**
   * Crea un nuevo usuario
   * @param createUserDto datos para crear un nuevo usuario
   * @returns {CreateUserDto}
   */
  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(createUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      this._handleDBErrors(error);
    }
  }

  /**
   * Manejo de errores de base de datos
   * @param error 
   */
  //! NEVER: indica que este método no retornará nada, ya que siempre lanzará una excepción.
  private _handleDBErrors(error: any): never {
    if (error.code === '23505') 
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new BadRequestException('Please check server logs');
  }
}
