import { registerAs } from '@nestjs/config';
import path from 'path';

/**
 * @description set some config options for TYPEORM
 */
const entityPath = path.join(__dirname, '/../../');
const migrationPath = path.join(__dirname, '/../../');

export default registerAs('database', () => ({
  name: 'default',
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  port: parseInt(process.env.DB_PORT, 10),
  synchronize: false,
  logging: process.env.LOGGING,
  keepConnectionAlive: true,
  entities: [entityPath + process.env.DB_ENTITIES],
  migrations: [migrationPath + process.env.DB_MIGRATIONS],
  cli: {
    migrationsDir: 'dist/migrations',
    entitiesDir: 'dist/modules/auth/entities',
  },
}));
