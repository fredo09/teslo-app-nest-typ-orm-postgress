import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
	@ApiProperty({
		description: 'Número de elementos a omitir antes de comenzar a recoger los resultados',
		example: 10,
	})
	@IsOptional()
	@IsPositive()
	// Transforma el valor a number
	@Type(() => Number)
	offSet?: number;

	@ApiProperty({
		description: 'Número de elementos a omitir antes de comenzar a recoger los resultados',
		example: 0,
	})
	@IsOptional()
	@Min(0)
	// Transforma el valor a number
	@Type(() => Number)
	limit?: number;
}