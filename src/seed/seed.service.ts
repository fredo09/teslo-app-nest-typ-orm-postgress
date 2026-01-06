import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './seed-data';

/**
 * Servicio de seed
 * Maneja la lógica de negocio relacionada con la inicialización de datos en la base de datos
 * Proporciona métodos para ejecutar el seed de la base de datos
 * @author fredy_vazzqz
 * @version 1.0.0
 */

@Injectable()
export class SeedService {
  constructor(
    //! Inyectamos el servicio de productos para usar sus métodos
    private readonly productsService: ProductsService
  ) {}

  /**
   * Ejecuta el seed de la base de datos
   * @returns Mensaje indicando que el seed se ha ejecutado
   */
  async runSeed() {
    await this._deleteProducts();
    await this._insertSeedProducts();
    return {
      message: 'Seed ejecutado correctamente 🚀',
    };
  }

  private async _deleteProducts() {
    //TODO: Insertar productos DESDE OTRO SERVICIO
    await this.productsService.deleteAllProducts();
    return true;
  }

  private async _insertSeedProducts() {
    const insertPromisesProducts: Promise<any>[] = [];
    const seedProducts = initialData.products;

    // seedProducts.forEach(productSeed => {
    //   insertPromisesProducts.push(this.productsService.create(productSeed));
    // });

    await Promise.all(insertPromisesProducts);
    return true;
  }
}
