/**
 * Filtro para validar archivos subidos.
 * @param req - La solicitud HTTP.
 * @param file - El archivo subido.
 * @param callback - La función de callback para indicar si el archivo es válido.
 * @returns 
 */
export const fileFilter = (
	req: Express.Request,
	file: Express.Multer.File,
	callback: Function,
) => {
	// Lógica del filtro de archivos

	if (!file) return callback(new Error('file is empty'), false);

	const fileExtension = file.mimetype.split('/')[1];
	const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

	if (!validExtensions.includes(fileExtension)) {
		return callback(new Error('Invalid file type'), false);
	}

	callback(null, true);
}