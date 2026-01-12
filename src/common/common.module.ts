import { Module } from '@nestjs/common';
import { BcryptAdapter } from './adapter/bcrypt.adatper';

@Module({
	providers: [ BcryptAdapter ],
	exports: [ BcryptAdapter ],
})
export class CommonModule {}

