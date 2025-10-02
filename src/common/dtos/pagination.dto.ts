import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

/* 
	! se resibe como string y lo convertimos a number con el decorador Type
	! igual al 'enableImplicitConversion: true' en el main.ts '@Type(() => Number)'
*/ 

/**
 * DTO para la paginación de resultados
 * Incluye propiedades opcionales para el desplazamiento (offSet) y el límite (limit)
 * Utiliza validaciones para asegurar que los valores sean positivos y válidos
 * @author fredy_vazzqz
 * @version 1.0.0
 */

export class PaginationDto {
	@IsOptional()
	@IsPositive()
	// Transforma el valor a number
	@Type(() => Number)
	offSet?: number;

	@IsOptional()
	@Min(0)
	// Transforma el valor a number
	@Type(() => Number)
	limit?: number;
}