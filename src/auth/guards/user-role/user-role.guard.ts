import { BadGatewayException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/roles-protected/roles-protected.decorator';
// import { User } from 'src/auth/entities/user.entity';

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
    const validRoles: string[] = this.reflector.get<string[]>(META_ROLES, context.getHandler());
    const { user } = context.switchToHttp().getRequest();
    // const { user }: { user: User } = context.switchToHttp().getRequest();

    if (!validRoles || validRoles.length === 0) return true;

    if (!user)
      throw new BadGatewayException('User not found in request');

    for(const role of user.roles) {
      if (validRoles.includes(role)) {
        return true;
      }
    }

    throw new BadGatewayException(`User ${user.fullName} does not have valid roles`);
    // return user.roles.some(role => validRoles.includes(role));
  }
}
