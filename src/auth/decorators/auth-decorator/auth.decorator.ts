import { AuthGuard } from '@nestjs/passport';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRoleGuard } from 'src/auth/guards/user-role/user-role.guard';
import { RolesProtected } from '../roles-protected/roles-protected.decorator';
import { ValidRoles } from 'src/auth/interfaces';

/**
 * Decorator de autenticación que combina múltiples decoradores para proteger rutas.
 * Permite especificar roles válidos para acceder a la ruta.
 * Utiliza AuthGuard para la autenticación basada en JWT y UserRoleGuard para la autorización basada en roles.
 * @param roles 
 * @returns 
 */
export function Auth(...roles: ValidRoles[]) {
  	return applyDecorators(
		RolesProtected(...roles), //* Protege la ruta con roles (sin especificar roles, permite todos)
		UseGuards(AuthGuard(), UserRoleGuard), //* Protege la ruta con AuthGuard con ajustes y tokens JWT
	);
}