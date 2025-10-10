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
