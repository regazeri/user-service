import dotenv from 'dotenv';
dotenv.config({ path: '.env.example' });
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { error, info } from 'console';

import { AppModule } from './app.module';
import { createSwagger, initServer } from './config';
/**
 * @description
 * we initialize app
 * use pino as a default debugger
 */
const { SWAGGER_ENABLE: swaggerEnable, PORT: port } = process.env;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  initServer(app);
  // useful in development mode
  if (!swaggerEnable || swaggerEnable === '1') {
    createSwagger(app);
  }
  app.enable('trust proxy');
  await app.listen(port, () => {
    info(`User Service Successfully Started port ${port}...!`);
  });
}
bootstrap().catch(err => error('something went wrong!', { err }));
