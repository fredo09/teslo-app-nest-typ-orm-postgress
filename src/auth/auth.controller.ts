import { AuthService } from './auth.service';
import { Controller, Post, Body } from '@nestjs/common';

import { CreateUserDto } from './dto/user.dto';

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

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
}
