import { join } from 'path';
import { existsSync } from 'fs';
import { BadRequestException, Injectable } from '@nestjs/common';

/**
 * Servicio para la gestión de archivos.
 * Proporciona métodos para manejar la lógica de negocio relacionada con archivos.
 * @author Alfredo Vázquez
 * @version 1.0.0
 */
@Injectable()
export class FilesService {

	/**
	 * Obtiene la ruta de la imagen de producto estática.
	 * @param imageName - Nombre de la imagen a buscar.
	 * @returns La ruta de la imagen si existe, o lanza una excepción si no.
	 */
	getStaticProductImage(imageName: string) {
		const path = join(__dirname, '../../static/products', imageName);

		if (!existsSync(path)) 
			throw new BadRequestException(`Image not found with ${imageName}`);

		return path;
	}
}
