import { ApiProperty } from '@nestjs/swagger';
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
	@ApiProperty({
		description: 'Título del producto',
		example: 'Camiseta Teslo',
		nullable: false,
		minLength: 1,
	})
	@IsString()
	@MinLength(1)
	title: string;

	@ApiProperty({
		description: 'Precio del producto',
		example: 29.99,
		nullable: false,
	})
	@IsNumber()
	@IsPositive()
	@IsOptional()
	price?: number;

	@ApiProperty({
		description: 'Descripción del producto',
		example: 'Camiseta de algodón de alta calidad',
		nullable: true,
	})
	@IsString()
	@IsOptional()
	description?: string;

	@ApiProperty({
		description: 'Slug del producto',
		example: 'camiseta-teslo',
		nullable: true,
	})
	@IsString()
	@IsOptional()
	slug?: string;

	@ApiProperty({
		description: 'Stock del producto',
		example: 100,
		nullable: true,
	})
	@IsInt()
	@IsPositive()
	@IsOptional()
	stock?: number;

	@ApiProperty({
		description: 'Tallas disponibles',
		example: ['S', 'M', 'L'],
		nullable: false,
	})
	@IsString({ each: true })
	@IsArray()
	sizes: string[];

	@ApiProperty({
		description: 'Género del producto',
		example: 'unisex',
		nullable: false,
	})
	@IsIn(['male', 'female', 'unisex']) //! definimos los valoes permitidos
	gender: string;

	@ApiProperty({
		description: 'Etiquetas del producto',
		example: ['verde', 'comoda'],
		nullable: true,
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	tags: string[];

	@ApiProperty({
		description: 'Imágenes del producto',
		example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
		nullable: true,
	})
	//* IMAGES
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	images?: string[];
}
