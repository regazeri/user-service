import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * @description set config options for api documentation with swagger
 * @example see documentation in http://localhost:4002/docs
 */
export const createSwagger = (app: INestApplication): void => {
  const {
    SWAGGER_TITLE: swaggerTitle,
    SWAGGER_DESCRIPTION: swaggerDescription,
    SWAGGER_PREFIX: swaggerPrefix,
  } = process.env;
  const version = '1.0.0';
  const options = new DocumentBuilder()
    .setTitle(swaggerTitle)
    .setDescription(swaggerDescription)
    .setVersion(version)
    .addBearerAuth({ type: 'http' }, 'access-token')
    .addTag('user-service')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(swaggerPrefix, app, document);
};
