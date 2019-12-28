import * as knex from 'knex';
import uuid from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const jwtKey = process.env.JWT_KEY || 'pepperoni';

export interface UserAuth {
  user_id: string;
  email: string;
  username: string;
  password: string;
}

function authenticateUser(knex: knex) {
  return (identifier: string, password: string): Promise<UserAuth | false> =>
    new Promise<UserAuth | false>((resolve, reject) => {
      knex('user_auth')
        .select('user_id', 'username', 'email', 'password')
        .where({ username: identifier })
        .orWhere({ email: identifier })
        .then(res => {
          if (res.length === 0) return reject();
          if (bcrypt.compareSync(password, res[0].password)) resolve(res[0]);
          resolve(false);
        })
        .catch(reject);
    });
}

function newUser(knex: knex) {
  var salt = bcrypt.genSaltSync(10);
  return (
    email: string,
    username: string,
    password: string
  ): Promise<UserAuth> =>
    new Promise((resolve, reject) => {
      const user = {
        user_id: uuid(),
        email,
        username,
        password: bcrypt.hashSync(password, salt),
      };
      knex('user_auth')
        .insert(user)
        .then(() => resolve(user))
        .catch(reject);
    });
}

function isUsernameAvailable(knex: knex) {
  return (username: string): Promise<boolean> =>
    new Promise<boolean>((resolve, reject) => {
      knex('user_auth')
        .where({ username })
        .then(res => resolve(res.length === 0))
        .catch(reject);
    });
}

function isEmailAvailable(knex: knex) {
  return (email: string): Promise<boolean> =>
    new Promise<boolean>((resolve, reject) => {
      knex('user_auth')
        .where({ email })
        .then(res => resolve(res.length == 0))
        .catch(reject);
    });
}

function createToken(user: UserAuth) {
  return jwt.sign({ id: user.user_id, username: user.username }, jwtKey);
}

export default (knex: knex) => ({
  authenticateUser: authenticateUser(knex),
  newUser: newUser(knex),
  isUsernameAvailable: isUsernameAvailable(knex),
  isEmailAvailable: isEmailAvailable(knex),
  createToken,
});
