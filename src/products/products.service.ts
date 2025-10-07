import { 
  Logger,
  Injectable, 
  BadRequestException, 
  InternalServerErrorException, 
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

/**
 * Servicio de productos
 * Maneja la lógica de negocio relacionada con los productos
 * Utiliza el repositorio de productos para interactuar con la base de datos
 * Proporciona métodos para crear, obtener, actualizar y eliminar productos
 * Incorpora manejo de excepciones para errores comunes
 * @author fredy_vazzqz
 * @version 1.0.0
 */
@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  //* Ocupamos usar el patron repository para trabajar con la base de datos
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  /**
   * Crea un nuevo producto
   * @param createProductDto datos para crear un nuevo producto
   * @returns 
   */
  async create(createProductDto: CreateProductDto) {
    try {
      const savedProduct = this.productsRepository.create(createProductDto);
      await this.productsRepository.save(savedProduct);

      return savedProduct;
    } catch (error) {
      this._handleExceptions(error);
    }
  }

  /**
   * Encontrar todos los productos
   * @returns Una lista de todos los productos
   */
  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offSet = 0 } = paginationDto;
    return this.productsRepository.find({
      take: limit,
      skip: offSet
      //TODO: relaciones
    });
  }

  /**
   * Busca un producto por su ID
   * @param id identificador del producto a buscar
   * @returns 
   */
  async findOne(term: string) {
    let product: Product | null;

    if (isUUID(term)) {
      product = await this.productsRepository.findOneBy({ id: term });
    } else {
      // product = await this.productsRepository.findOneBy({ slug: term });
      const queryBuilder = this.productsRepository.createQueryBuilder(); //* Creacion de un query builder
      product = await queryBuilder.where('UPPER(title) =:title or slug =: slug', {
        title: term.toUpperCase(),
        slug: term.toLowerCase()
      }).getOne();
    }

    if (!product)
      throw new BadRequestException(`Product with id ${term} not found`);

    return product;
  }

  /**
   * Actualiza un producto por su ID
   * @param id identificador del producto a actualizar
   * @param updateProductDto datos a actualizar
   * @returns 
   */
  update(id: string, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  /**
   * Elimina un producto por su ID
   * @param id identificador del producto a eliminar
   * @returns 
   */
  async remove(id: string) {
    const findProduct = await this.findOne(id);
    await this.productsRepository.remove(findProduct);
    return `Product with id ${id} has been removed` ;
  }

  /**
   * @description Maneja las excepciones lanzadas por la base de datos
   * @param error 
   */
  private _handleExceptions(error: any) {
    if (error.code === '23505') 
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
