import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from 'src/auth/interfaces';

/**
 *  Decorador para proteger rutas basadas en roles de usuario.
 *  Utiliza SetMetadata para asignar roles válidos a los metadatos de la ruta.
 *  Estos metadatos son luego utilizados por UserRoleGuard para verificar el acceso.
 * @author Alfredo Vázquez
 * @version 1.0.0
 * @param args 
 * @returns 
 */
export const META_ROLES = 'roles';

export const RolesProtected = (...args: ValidRoles[]) => {
	return SetMetadata( META_ROLES, args );
};
