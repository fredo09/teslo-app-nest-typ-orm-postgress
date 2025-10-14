import { 
	IsArray, 
	IsIn, 
	IsInt, 
	IsNumber, 
	IsOptional, 
	IsPositive, 
	IsString, 
	MinLength } 
from "class-validator";

/**
 * DTO para crear un producto
 * Define y valida la estructura de los datos necesarios para crear un producto
 * Utiliza decoradores de class-validator para asegurar que los datos cumplen con los requisitos
 * Incluye propiedades como título, precio, descripción, slug, stock, tallas, género, etiquetas e imágenes
 * @author fredy_vazzqz
 * @version 1.0.0
 */
//* informacion que se necesita para insertar un producto a la base de datos
export class CreateProductDto {
	@IsString()
	@MinLength(1)
	title: string;

	@IsNumber()
	@IsPositive()
	@IsOptional()
	price?: number;

	@IsString()
	@IsOptional()
	description?: string;

	@IsString()
	@IsOptional()
	slug?: string;

	@IsInt()
	@IsPositive()
	@IsOptional()
	stock?: number;

	@IsString({ each: true })
	@IsArray()
	sizes: string[];

	@IsIn(['male', 'female', 'unisex']) //! definimos los valoes permitidos
	gender: string;

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	tags: string[];

	//* IMAGES
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	images?: string[];
}
