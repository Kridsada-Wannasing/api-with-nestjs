import { CacheModule, Module } from '@nestjs/common';
import PostsController from './posts.controller';
import PostsService from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsSearchService } from './posts-search.service';
import Post from './post.entity';
import { SearchModule } from '../search/search.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { PrismaModule } from '../prisma/prisma.module';
import { PostsResolver } from './posts.resolver';
import { UsersModule } from '../users/users.module';
import PostsLoaders from './loaders/posts.loaders';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    SearchModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        ttl: 120,
      }),
    }),
    PrismaModule,
    UsersModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsSearchService, PostsResolver, PostsLoaders],
})
export class PostsModule {}
