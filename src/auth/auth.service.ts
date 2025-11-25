import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';

import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { BcryptAdapter } from './../common/adapter/bcrypt.adatper';

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
    private readonly userRepository: Repository<User>,
    private readonly bcryptAdapter: BcryptAdapter
  ) {}

  /**
   * Crea un nuevo usuario
   * @param {createUserDto} datos para crear un nuevo usuario
   * @returns {CreateUserDto}
   */
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: this.bcryptAdapter.hashSync(password),
      });

      //TODO: QUITAR EL PASSWORD DEL RETORNO DEL USUARIO CREADO
      return await this.userRepository.save(user);
    } catch (error) {
      this._handleDBErrors(error);
    }
  }

  /**
   * Inicia sesión de un usuario
   * @param {LoginUserDto} datos de inicio de sesión
   * @returns el usuario autenticado
   */
  async login({ email, password }: LoginUserDto) {
    const findUser = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true } // * seleccionamos el password ya que por defecto no se selecciona
    });

    const isValidPassword = this.bcryptAdapter.compareSync(password, findUser?.password || '');

    if (!findUser)
      throw new UnauthorizedException('Credentials are not valid (email or password)');

    if (!isValidPassword)
      throw new UnauthorizedException('Credentials are not valid (email or password)');

    //TODO: RETORNAR EL JWT
    return findUser;
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
    this.logger.log(`🚀 ~ ha ocurrido un error: ${error.message}`);
    throw new BadRequestException('Please check server logs');
  }
}
