import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

/**
 * DTO para actualizar un producto
 * Extiende de CreateProductDto para reutilizar las validaciones
 * Todas las propiedades son opcionales para permitir actualizaciones parciales
 * @author fredy_vazzqz
 * @version 1.0.0
 */
export class UpdateProductDto extends PartialType(CreateProductDto) {}
