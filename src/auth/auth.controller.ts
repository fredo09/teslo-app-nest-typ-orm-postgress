import { 
  Controller,
  Get,
  Post, 
  Body,
  UseGuards
//  SetMetadata
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from './guards/user-role/user-role.guard';

import { CreateUserDto, LoginUserDto } from './dto';
import { Auth, GetRawHeadersDecorator, GetUserDecorator } from './decorators';

import { User } from './entities/user.entity';
import { ValidRoles } from './interfaces';
import { RolesProtected } from './decorators';

/**
 * Controlador de autenticación que maneja las solicitudes relacionadas con la autenticación de usuarios.
 * Utiliza el servicio AuthService para realizar operaciones de autenticación.
 * Proporciona un endpoint para registrar nuevos usuarios.
 * @author Alfredo Vázquez
 * @version 1.0.0
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Crea un nuevo usuario
   * @param createUserDto datos para crear un nuevo usuario
   * @returns {CreateUserDto} el usuario creado
   */
  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  /**
   * Inicia sesión de un usuario
   * @param {LoginUserDto} datos de inicio de sesión
   * @returns el usuario autenticado
   */
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  /**
   * Ruta privada de prueba
   * @returns 
   */
  @Get('private')
  @UseGuards(AuthGuard()) //* Protege la ruta con AuthGuard con ajustes y tokens JWT
  testingPrivateRoute(
    // @Req() request: Express.Request -> docorador por defecto de NestJS y request de Express
    @GetUserDecorator() user: User,
    @GetUserDecorator('email') userEmail: string,
    @GetRawHeadersDecorator() rawHeaders: string[]
  ) {
    return {
      ok: true,
      message: 'Hola Mundo Private',
      user,
      userEmail,
      rawHeaders
    }
  }

  //! FORMA MUY TEDIOSA DE PROTEGER RUTAS CON ROLES Y RECUPERAR DATA DE USUARIO LOGEADO
  // @Get('private2')
  // @SetMetadata('roles', ['admin', 'superUser']) //* Asigna metadatos personalizados a la ruta
  // @UseGuards(AuthGuard(), UserRoleGuard) //* Protege la ruta con AuthGuard con ajustes y tokens JWT
  // testingPrivateRoute2(
  //   @GetUserDecorator() user: User
  // ) {
  //   return {
  //     ok: true,
  //     message: 'Hola Mundo Private 2',
  //     user
  //   }
  // }


  //! FORMA MEJORADA DE PROTEGER RUTAS CON ROLES Y RECUPERAR DATA DE USUARIO LOGEADO USANDO UN ROLE DECORATOR 
  @Get('private2')
  @RolesProtected(ValidRoles.admin, ValidRoles.user) //* Protege la ruta con roles (sin especificar roles, permite todos)
  @UseGuards(AuthGuard(), UserRoleGuard) //* Protege la ruta con AuthGuard con ajustes y tokens JWT
  testingPrivateRoute2(
    @GetUserDecorator() user: User
  ) {
    return {
      ok: true,
      message: 'Hola Mundo Private 2 con roles definidos',
      user
    }
  }

  /*
  !FORMA MEJORADA DE PROTEGER RUTAS CON ROLES Y RECUPERAR DATA DE USUARIO LOGEADO USANDO UN CUSTOM ROLE DECORATOR PARA AGRUPAR MAS DECORADORES
  */
  @Get('private3')
  @Auth(ValidRoles.user) //* Protege la ruta con AuthGuard con ajustes y tokens JWT
  testingPrivateRoute3(
    @GetUserDecorator() user: User
  ) {
    return {
      ok: true,
      message: 'Hola Mundo Private 3 con roles definidos',
      user
    }
  }
}