import { registerAs } from '@nestjs/config';
import { Env } from 'common-panel';
import { RedisModuleOptions } from 'nestjs-redis';

/**
 * Register redis configurations
 */
export const redisConfig = registerAs('redis', function (): RedisModuleOptions {
  return {
    port: Env.getNumber('REDIS_PORT', 6379),
    host: Env.getString('REDIS_HOST', 'localhost'),
    password: Env.getString('REDIS_PASSWORD'),
    db: Env.getNumber('REDIS_DB', 0),
    family: Env.getNumber('REDIS_FAMILY', 4),
  };
});
