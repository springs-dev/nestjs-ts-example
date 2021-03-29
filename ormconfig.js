const SnakeNamingStrategy = require('typeorm-naming-strategies')
  .SnakeNamingStrategy;
const process = require('process');

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  dropSchema: false,
  logging:
    process.env.DB_LOGGING !== undefined && process.env.DB_LOGGING !== 'false',
  entities: ['src/**/**.entity.ts'],
  subscribersDir: ['src/**/subscribers'],
  migrations: ['migrations/**.ts'],
  cli: {
    subscribersDir: ['src/**/subscribers'],
    entitiesDir: 'src/**/entities',
    migrationsDir: 'migrations',
  },
  namingStrategy: new SnakeNamingStrategy(),
};
