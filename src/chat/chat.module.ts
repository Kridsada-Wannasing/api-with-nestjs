import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import Message from './message.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Message])],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
