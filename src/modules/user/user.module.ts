import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRabbitMqModule } from './../rabbit-mq/rabbit-mq.module';
import { UserController } from './controllers/user.controller';
import { UserRepository } from './repositories';
import { UserService } from './services/user.service';
import { UserRedisService } from './services/user-redis-service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    UserRabbitMqModule,
    ConfigModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRedisService],
})
export class UserModule {}
