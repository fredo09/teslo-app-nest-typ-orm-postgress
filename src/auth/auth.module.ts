import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { User } from './entities/user.entity';

import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    TypeOrmModule.forFeature([ //* Nos permite importar las entidades y hacer tablas en DB
      User
    ]),
    //! Importamos el PassportModule para usar JWT
    PassportModule.register({ defaultStrategy: 'jwt' }), //* -> importamos el PassportModule para usar JWT

    //! Importamos el JwtModule para manejar la generación y validación de tokens JWT
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET || 'defaultSecretKey', //* -> clave secreta para firmar los tokens JWT
    //   signOptions: {
    //     expiresIn: process.env.JWT_EXPIRES_IN || '1h', //* -> tiempo de expiración del token
    //   },
    // }),

    //* Usando modulos asincronos para jwtModule
    JwtModule.registerAsync({ // * -> usamos registerAsync para cargar la configuración de forma asíncrona
      imports: [ConfigModule], //* -> importamos el ConfigModule para acceder a las variables de entorno
      inject: [ConfigService], //* -> inyectamos el ConfigService para acceder a las variables de entorno
      useFactory: (configService: ConfigService) => ({ // * -> usamos una fábrica para configurar el módulo
        secret: configService.get('JWT_SECRET'),//* -> obtenemos la clave secreta desde las variables de entorno
        signOptions: {//* -> configuramos las opciones de firma del token */
          expiresIn: configService.get('JWT_EXPIRES_IN', '1h'),//* -> obtenemos el tiempo de expiración desde las variables de entorno
        }
      })
    }),

    CommonModule //* -> importamos el CommonModule para usar el BcryptAdapter 
  ]
})
export class AuthModule {}
