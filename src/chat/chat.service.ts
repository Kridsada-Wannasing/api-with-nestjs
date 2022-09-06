import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import User from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import Message from './message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  async getUserFromSocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;
    const { Authentication: authToken } = parse(cookie);
    const user = await this.authService.getUserFromAuthenticationToken(
      authToken,
    );

    if (!user) {
      throw new WsException('Invalid credentials.');
    }

    return user;
  }

  async saveMessage(content: string, author: User) {
    const newMessage = this.messagesRepository.create({
      content,
      author,
    });

    await this.messagesRepository.save(newMessage);
    return newMessage;
  }

  async getAllMessages() {
    return this.messagesRepository.find({ relations: ['author'] });
  }
}
