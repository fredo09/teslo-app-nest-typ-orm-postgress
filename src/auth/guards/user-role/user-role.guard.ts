import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

/**
 * Guardia de rol de usuario para proteger rutas basadas en roles.
 * Actualmente permite el acceso a todas las solicitudes.
 * @author Alfredo Vázquez
 * @version 1.0.0
 */
@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // * Obtener los roles válidos desde los metadatos de la ruta
    const validRoles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log({ validRoles });

    return true;
  }
}
