module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'password',
  database: 'dbuser',
  logging: true,
  migrationsRun: true,
  synchronize: false,
  keepConnectionAlive: true,
  entities: ['src/modules/*/entities/*.entity.{ts,js}'],
  migrations: ['src/migrations/*.{js,ts}'],
  cli: {
    entitiesDir: 'src/modules/*/entities',
    migrationsDir: 'src/migrations',
  },
};


