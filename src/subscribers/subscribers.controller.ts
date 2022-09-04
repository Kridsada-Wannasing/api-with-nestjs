import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import JwtAuthGuard from '../auth/guards/jwt-auth.guard';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import SubscribersService from './subscribers.service.interface';

@Controller('subscribers')
@UseInterceptors(ClassSerializerInterceptor)
export class SubscribersController implements OnModuleInit {
  private subscribersService: SubscribersService;

  constructor(@Inject('SUBSCRIBERS_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.subscribersService =
      this.client.getService<SubscribersService>('SubscribersService');
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getSubscribers() {
    return this.subscribersService.getAllSubscribers({});
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(@Body() subscriber: CreateSubscriberDto) {
    return this.subscribersService.addSubscriber(subscriber);
  }
}
