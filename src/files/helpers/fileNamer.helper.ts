
import { v4 as uuid } from 'uuid';

/**
 * Genera un nombre de archivo único para los archivos subidos.
 * @param req - La solicitud HTTP.
 * @param file - El archivo subido.
 * @param callback - La función de callback para devolver el nombre del archivo.
 * @returns 
 */
export const fileNamer = (req: Express.Request, file: Express.Multer.File, callback: Function) => {
	console.log("🚀 ~ fileNamer ~ file:", file)
	if(!file) return callback(new Error('file is empty'), false);

	const fileExtension = file.mimetype.split('/')[1];
	const fileName = `${uuid()}.${fileExtension}`;

	callback(null, fileName);
}