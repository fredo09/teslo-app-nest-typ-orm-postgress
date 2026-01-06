import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/auth/entities/user.entity';
import { ProductsService } from '../products/products.service';
import { BcryptAdapter } from 'src/common/adapter/bcrypt.adatper';

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
    private readonly productsService: ProductsService,
    private readonly bcryptAdapter: BcryptAdapter,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  /**
   * Ejecuta el seed de la base de datos
   * @returns Mensaje indicando que el seed se ha ejecutado
   */
  async runSeed() {
    await this._deleteAllTables();
    const adminUser = await this._insertAllUsers();
    await this._insertSeedProducts(adminUser);
    return {
      message: 'Seed ejecutado correctamente 🚀',
    };
  }

  /**
   * Elimina todos los productos de la base de datos
   * @returns true si se eliminaron correctamente
   */
  private async _deleteProducts() {
    //TODO: Insertar productos DESDE OTRO SERVICIO
    await this.productsService.deleteAllProducts();
    return true;
  }

  /**
   * Inserta los usuarios de seed en la base de datos
   * @returns el usuario admin insertado
   */
  private async _insertAllUsers() {
    const userData = initialData.users;
    const users: User [] = [];

    userData.forEach((user) => {
      user.password = this.bcryptAdapter.hashSync(user.password);
      users.push(this.userRepository.create(user))
    });

    const dbUsers = await this.userRepository.save(userData);

    return dbUsers[0]; // Retornamos el primer usuario (admin)
  }

  /**
   * Encripta los passwords de los usuarios de seed
   * @param {Array} Seed de usuarios a insertar
   * @returns {Array} usuarios con el password ya encriptado
   */
  private _bycriptPasswords(users: any[]) {
    return users.map(user => user.password = this.bcryptAdapter.hashSync(user.password))
  }

  /**
   * Inserta los productos de seed en la base de datos
   * @returns true si se insertaron correctamente
   */
  private async _insertSeedProducts(user: User) {
    const insertPromisesProducts: Promise<any>[] = [];
    const seedProducts = initialData.products;

    seedProducts.forEach(productSeed => {
      insertPromisesProducts.push(this.productsService.create(productSeed, user));
    });

    await Promise.all(insertPromisesProducts);
    return true;
  }

  /**
   * Elimina todas las tablas de la base de datos
   * @returns true si se eliminaron correctamente
   */
  private async _deleteAllTables() {
    await this._deleteProducts();

    const queryUserBuilder = this.userRepository.createQueryBuilder();
    await queryUserBuilder
      .delete()
      .where({})
      .execute();
    
    return true;
  }
}
