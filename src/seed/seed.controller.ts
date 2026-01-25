import { ApiTags } from '@nestjs/swagger';
import { SeedService } from './seed.service';
import { Controller, Get } from '@nestjs/common';

// import { Auth } from 'src/auth/decorators';
// import { ValidRoles } from 'src/auth/interfaces';

/**
 * Controlador de seed
 * Maneja las rutas relacionadas con la inicialización de datos en la base de datos
 * Utiliza el servicio de seed para ejecutar la lógica de negocio
 * @author fredy_vazzqz
 * @version 1.0.0
 */

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  /**
   * Ejecuta el seed de la base de datos
   * @returns Mensaje indicando que el seed se ha ejecutado
   */
  @Get()
  // @Auth(ValidRoles.admin)
  executeSeed() {
    return this.seedService.runSeed();
  }
}
