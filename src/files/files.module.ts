import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigModule } from '@nestjs/config';

/**
 * Módulo para la gestión de archivos.
 * Agrupa el controlador y el servicio relacionados con archivos.
 * @author Alfredo Vázquez
 * @version 1.0.0
 */

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [ConfigModule],
})
export class FilesModule {}
