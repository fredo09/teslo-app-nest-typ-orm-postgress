
/**
 * HttpAdapterI interface defines the contract for HTTP adapters.
 * It requires an implementation of a `get` method that takes a URL as a string
 * and returns a Promise that resolves to any type of data.
 */
export interface BcryptAdapterI {
	/**
	 * Genera un hash para la contraseña proporcionada
	 * @param password la contraseña a hashear
	 * @param saltRounds el número de rondas de sal (opcional, por defecto es 10)
	 */
	hashSync(password: string, saltRounds: number): string;

	/**
	 * Compara una contraseña en texto plano con un hash
	 * @param password la contraseña a comparar
	 * @param hash el hash contra el que se va a comparar
	 */
	compareSync(password: string, hash: string): boolean;
}
