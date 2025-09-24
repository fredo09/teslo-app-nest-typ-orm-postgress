import { 
  Logger,
  Injectable, 
  BadRequestException, 
  InternalServerErrorException, 
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { Product } from './entities/product.entity';
@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  //* Ocupamos usar el patron repository para trabajar con la base de datos
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const savedProduct = this.productsRepository.create(createProductDto);
      await this.productsRepository.save(savedProduct);

      return savedProduct;
    } catch (error) {
      this._handleExceptions(error);
    }
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  private _handleExceptions(error: any) {
    if (error.code === '23505') 
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
