module.exports = {
  type: 'postgres',
  host: 'postgres-user',
  port: 5432,
  username: 'postgres',
  password: 'Jie7eich',
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
