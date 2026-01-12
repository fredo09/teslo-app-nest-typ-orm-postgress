import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from 'src/products/products.module';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';

/**
 * Módulo de seed
 * Agrupa el controlador y el servicio de seed
 * @author fredy_vazzqz
 * @version 1.0.0
 */

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    ProductsModule,
    AuthModule,
    CommonModule
  ],
})
export class SeedModule {}
