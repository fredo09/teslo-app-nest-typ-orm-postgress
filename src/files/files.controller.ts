import {
  Post,
  Controller,
  UploadedFile, 
  UseInterceptors,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { FilesService } from './files.service';
import { fileFilter } from './helpers/fileFilter.helper';


/**
 * Controlador para la gestión de archivos.
 * Proporciona endpoints para subir y manejar archivos.
 * Utiliza el servicio FilesService para la lógica de negocio relacionada con archivos.
 * @author Alfredo Vázquez
 * @version 1.0.0
 */

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter
  })) // 'file' es el nombre del campo en el formulario que contiene el archivo
  uploadProductImageFile(
    @UploadedFile() file: Express.Multer.File, // 'Indica el tipado de file ' Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('File not provided or invalid');
    }

    return file;
  }
}
