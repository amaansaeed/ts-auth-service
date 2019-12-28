// Update with your config settings.
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${process.env.ENV || 'development'}`),
});

const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: DB_HOST,
      database: DB_NAME,
      user: DB_USER,
      password: DB_PASSWORD,
    },
    migrations: {
      directory: 'src/db/migrations',
      extension: 'ts',
    },
    seeds: {
      directory: 'src/db/seeds',
      extension: 'ts',
    },
  },
  test: {
    client: 'postgresql',
    connection: {
      host: DB_HOST,
      database: DB_NAME,
      user: DB_USER,
      password: DB_PASSWORD,
    },
    migrations: {
      directory: 'src/db/migrations',
      extension: 'ts',
    },
    seeds: {
      directory: 'src/db/seeds',
      extension: 'ts',
    },
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};
