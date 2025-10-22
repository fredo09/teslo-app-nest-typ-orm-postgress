import {
  Post,
  Controller,
  UploadedFile, 
  UseInterceptors,
  BadRequestException,
  Get,
  Param,
  Res
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';
import { Response } from 'express';

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

  @Get('product/:imageName')
  fileProductImage(
    @Res() res: Response, // -> Response de Express
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.getStaticProductImage(imageName);
    res.sendFile(path);
  }

  /**
   * Maneja la subida de imágenes de productos.
   * @param file - El archivo subido.
   * @returns 
   */
  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    limits: {
      fileSize: 800000, // Tamaño máximo del archivo en bytes (800 KB)
    },
    storage: diskStorage({
      destination: './static/products', // Carpeta donde se guardarán los archivos subidos
      filename: fileNamer, //Renombrar el archivo usando el helper fileNamer
    })
  })) // 'file' es el nombre del campo en el formulario que contiene el archivo
  uploadProductImageFile(
    @UploadedFile() file: Express.Multer.File, // 'Indica el tipado de file ' Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('File not provided or invalid');
    }

    const secureUrl = `${file.filename}`

    return {fileImage: secureUrl};
  }
}
