import {
  Controller, 
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

/**
 * Controlador de productos
 * Maneja las rutas y las solicitudes HTTP relacionadas con los productos
 * Utiliza el servicio de productos para realizar operaciones CRUD
 * Define rutas para crear, obtener, actualizar y eliminar productos
 * Utiliza DTOs para validar y transformar los datos de entrada
 * Incorpora manejo de excepciones para errores comunes
 * @author fredy_vazzqz
 * @version 1.0.0
 */
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * Crea un nuevo producto
   * @param createProductDto datos para crear un nuevo producto
   * @returns El producto creado
   */
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  /**
   * Obtiene todos los productos
   * @returns Una lista de todos los productos
   */
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  /**
   * Busca un producto por su ID
   * @param id identificador del producto a buscar
   * @returns 
   */
  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsService.findOne(term);
  }

  /**
   * Actualiza un producto por su ID
   * @param id identificador del producto a actualizar
   * @param updateProductDto datos a actualizar
   * @returns 
   */
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  /**
   * Elimina un producto por su ID
   * @param id identificador del producto a eliminar
   * @returns 
   */
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
