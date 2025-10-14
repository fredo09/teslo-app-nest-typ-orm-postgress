import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// * SERVICES AND CONTROLLERS
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

// * ENTITIES
import { Product, ProductImage } from './entities';

/**
 * Módulo de productos
 * Configura el módulo de productos en la aplicación NestJS
 * Importa las entidades necesarias para TypeORM
 * Declara el controlador y el servicio de productos
 * @author fredy_vazzqz
 * @version 1.0.0
 */
@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  //* Importamos todos los entities para typeorm
  imports: [TypeOrmModule.forFeature([
    // * Entities ORM -> Poner cada entidad que se cree y se vaya a usar en el modulo
    Product,
    ProductImage
  ])],
})
export class ProductsModule {}
