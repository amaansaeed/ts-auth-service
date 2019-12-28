import knex, { Config } from 'knex';
import userAuth from './models/UserAuth';

class Connection {
  public knex = knex(exportConfig());
  public userAuth = userAuth(this.knex);
}

function exportConfig(): Config {
  const environment =
    !process.env.ENV || process.env.ENV === 'docker'
      ? 'development'
      : process.env.ENV;
  return require('../../knexfile')[environment];
}

export default new Connection();
