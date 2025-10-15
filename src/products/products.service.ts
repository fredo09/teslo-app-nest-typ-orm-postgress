import { 
  Logger,
  Injectable, 
  BadRequestException, 
  InternalServerErrorException,
  NotFoundException, 
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { isUUID } from 'class-validator';

import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { ProductImage, Product } from './entities';
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

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    // * Inyectamos el data source para manejar transacciones
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Crea un nuevo producto
   * @param createProductDto datos para crear un nuevo producto
   * @returns 
   */
  async create({ images = [], ...productDetails }: CreateProductDto) {
    try {
      const savedProduct = this.productsRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({
          url: image
        }))
      });
      await this.productsRepository.save(savedProduct);

      return { ...savedProduct, images };
    } catch (error) {
      this._handleExceptions(error);
    }
  }

  /**
   * Encontrar todos los productos
   * @returns Una lista de todos los productos
   */
  async findAll({ limit = 10, offSet = 0 } : PaginationDto) {
    const findProducts = await this.productsRepository.find({
      take: limit,
      skip: offSet,
      //TODO: relaciones
      relations: {
        images: true
      }
    });

    return findProducts.map(({ images, ...restProduct }) => ({
      ...restProduct,
      images: (images || [] ).map( img => img.url)
    }))
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
      const queryBuilder = this.productsRepository.createQueryBuilder('prod'); //* Creacion de un query builder
      product = await queryBuilder.where('UPPER(title)=:title or slug=:slug', {
        title: term.toUpperCase(),
        slug: term.toLowerCase()
      }).leftJoinAndSelect('prod.images', 'prodImages').getOne();
    }

    if (!product)
      throw new BadRequestException(`Product with id ${term} not found`);

    return product;
  }

  /**
   * Busca un producto por su término de búsqueda y devuelve una versión simplificada
   * del producto con solo las URLs de las imágenes.
   * @param term termino de busqueda
   * @returns {Object} objeto del producto con URLs de imágenes
   */
  async findOnePlainProduct(term: string) {
    const { images = [], ...restProduct } = await this.findOne(term);
    return {
      ...restProduct,
      images: images.map( img => img.url)
    }
  }

  /**
   * Actualiza un producto por su ID
   * @param id identificador del producto a actualizar
   * @param updateProductDto datos a actualizar
   * @returns 
   */
  async update( id: string, { images = [], ...updateProductDetail }: UpdateProductDto ) {
    //! prepara para la actualizacion
    const productUpdate = await this.productsRepository.preload({
      id,
      ...updateProductDetail,
    });
    
    if (!productUpdate)
      throw new NotFoundException(`Product with id ${id} not found`);

    //* Crear query runner y empezamos a realizar la transaccion
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // * Realizamos las operaciones de la transacción aqui
      if (images && images.length > 0) {
        // * Eliminar las imagenes existentes del producto
        await queryRunner.manager.delete(ProductImage, {product: { id }});
        productUpdate.images = images.map(
          image => this.productImageRepository.create({ url: image })
        );
      }

      await queryRunner.manager.save(productUpdate);

      //! realiza la actualizacion
      /**
       * comentado por sustitucion de transacciones 
       * const updatedProduct = await this.productsRepository.save(productUpdate);
       **/

      // * Si todas las operaciones son exitosas, confirmamos la transacción y liberamos el query runner
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlainProduct(id);
    } catch (error) {
      // * Si ocurre un error, revertimos la transacción y liberamos el query runner
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this._handleExceptions(error);
    }
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
