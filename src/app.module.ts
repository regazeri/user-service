import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'nestjs-redis';

import { databaseConfig, redisConfig } from './config';
import { validationSchema } from './helper';
import { UserRabbitMqModule } from './modules/rabbit-mq/rabbit-mq.module';
import { UserModule } from './modules/user/user.module';
import { DatabaseService } from './services/database.service';

/**
 * @description
 * run database service via typeorm module and also we separate the env file in dev and prod mode
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema,
      envFilePath: [
        '.env.example',
        // `${__dirname}/env/.env.development`,
        // `${__dirname}/env/.env.development`,
      ],
      load: [databaseConfig, redisConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseService,
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get('redis'),
      inject: [ConfigService],
    }),
    UserModule,
    UserRabbitMqModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
