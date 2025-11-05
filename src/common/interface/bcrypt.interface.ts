
/**
 * HttpAdapterI interface defines the contract for HTTP adapters.
 * It requires an implementation of a `get` method that takes a URL as a string
 * and returns a Promise that resolves to any type of data.
 */
export interface BcryptAdapterI {
	hashSync(password: string, saltRounds: number): string;
}