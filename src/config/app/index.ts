import { INestApplication } from '@nestjs/common';
import { HttpExceptionFilter, LoggingInterceptor } from 'common-panel';
import compression from 'compression';
// import * as csurf from 'csurf';
import RateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';

/**
 * @description set config options for api documentation with swagger
 * @param {app: INestApplication}
 */

export const initServer = (app: INestApplication): void => {
  const { API_PREFIX: apiPrefix } = process.env;

  app.setGlobalPrefix(apiPrefix);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.use(helmet());
  //   app.use(csurf());
 
  app.use(
    RateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );
  // he middleware will attempt to compress response bodies for all request that traverse through the middleware
  app.use(compression());
};
