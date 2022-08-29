import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ExceptionsLoggerFilter } from './utils/exceptions-logger.filter';
import { APP_FILTER } from '@nestjs/core';
import { CategoriesModule } from './categories/categories.module';
import { FilesModule } from './files/files.module';
import CategoriesController from './categories/categories.controller';
import CategoriesService from './categories/categories.service';

@Module({
  imports: [
    PostsModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
        PORT: Joi.number(),
      }),
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    FilesModule,
  ],
  controllers: [CategoriesController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionsLoggerFilter,
    },
    CategoriesService,
  ],
})
export class AppModule {}
