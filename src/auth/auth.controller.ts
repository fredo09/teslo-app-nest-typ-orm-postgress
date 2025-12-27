import { AuthService } from './auth.service';
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';

import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

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
  testingPrivateRoute() {
    return {
      ok: true,
      message: 'Hola Mundo Private'
    }
  }
}
