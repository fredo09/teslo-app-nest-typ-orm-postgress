import { Module } from '@nestjs/common';
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
    CommonModule //* -> importamos el CommonModule para usar el BcryptAdapter 
  ]
})
export class AuthModule {}
