import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { CommonModule } from './common/common.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { MessageWsModule } from './message-ws/message-ws.module';

/**
 * Módulo principal de la aplicación
 * Configura la conexión a la base de datos y carga los módulos necesarios
 * @author fredy_vazzqz
 * @version 1.0.0
 */

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? +process.env.DB_PORT: 5432,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASS,
      autoLoadEntities: true, //! sincronizar todos los entities
      synchronize: true, //! opcional para prod
    }),
    ServeStaticModule.forRoot({ //* Servir archivos estáticos 'images'
      rootPath: join(__dirname, '..', 'public'),
    }),
    ProductsModule,
    CommonModule,
    SeedModule,
    FilesModule,
    AuthModule,
    MessageWsModule,
  ]
})
export class AppModule {}
