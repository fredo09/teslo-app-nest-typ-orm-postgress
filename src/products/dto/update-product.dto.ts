// import { PartialType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger'; // se cambio a swagger para que se refleje en la documentacion de swagger
import { CreateProductDto } from './create-product.dto';

/**
 * DTO para actualizar un producto
 * Extiende de CreateProductDto para reutilizar las validaciones
 * Todas las propiedades son opcionales para permitir actualizaciones parciales
 * @author fredy_vazzqz
 * @version 1.0.0
 */
export class UpdateProductDto extends PartialType(CreateProductDto) {}
