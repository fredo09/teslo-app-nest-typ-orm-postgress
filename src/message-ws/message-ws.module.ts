import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { MessageWsService } from './message-ws.service';
import { MessageWsGateway } from './message-ws.gateway';

@Module({
  providers: [MessageWsGateway, MessageWsService],
  imports: [AuthModule],
})
export class MessageWsModule {}
