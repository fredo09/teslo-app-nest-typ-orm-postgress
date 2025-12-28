import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';

import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { BcryptAdapter } from './../common/adapter/bcrypt.adatper';

import { JwtPayloadI } from './interfaces/jwt-payload.interface';

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
    private readonly bcryptAdapter: BcryptAdapter,
    private readonly jwtService: JwtService
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

      await this.userRepository.save(user);

      return {
        email: user?.email,
        fullName: user?.fullName,
        token: this._getJwtToken({ id: user?.id })
      }

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
      select: { email: true, password: true, id: true } // * seleccionamos el password ya que por defecto no se selecciona
    });

    const isValidPassword = this.bcryptAdapter.compareSync(password, findUser?.password || '');

    if (!findUser)
      throw new UnauthorizedException('Credentials are not valid (email or password)');

    if (!isValidPassword)
      throw new UnauthorizedException('Credentials are not valid (email or password)');

    return {
      ...findUser,
      token: this._getJwtToken({ id: findUser?.id })
    };
  }

  /**
   * Genera un JWT  
   * @param payload 
   * @returns {Token}
   * @private
   */
  private _getJwtToken(payload: JwtPayloadI) {
    const token = this.jwtService.sign(payload);
    return token;
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
