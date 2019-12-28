/***********************************
 *  Dependencies
 ***********************************/
// import Router from 'koa-router';
import koa from 'koa';
import debug from 'debug';
import db from '../db';

/***********************************
 *  Variables & Initializations
 ***********************************/
const logger = debug('authentication-service:authentication');

/***********************************
 *  Controllers
 ***********************************/
const authenticateUser = async (ctx: koa.Context, next: Function) => {
  const { identifier, password } = ctx.request.body;
  if (
    !identifier ||
    identifier.length < 0 ||
    !password ||
    password.length < 0
  ) {
    ctx.response.status = 422;
    ctx.body = 'incomplete request';
    return;
  }

  const user = await db.userAuth.authenticateUser(identifier, password);
  if (!user) {
    ctx.response.status = 401;
    ctx.body = 'incorrect identifier password combo';
    return;
  }

  const token = db.userAuth.createToken(user);
  ctx.set('Access-Token', token);
  ctx.response.status = 200;
  ctx.body = 'authentication successful!';
};

const newUser = async (ctx: koa.Context, next: Function) => {
  const { username, email, password } = ctx.request.body;
  if (
    !username ||
    username.length < 0 ||
    !email ||
    email.length < 0 ||
    !password ||
    password.length < 0
  ) {
    ctx.response.status = 422;
    ctx.body = 'incomplete request';
    return;
  }

  const isEmailFree = await db.userAuth.isEmailAvailable(email);
  const isUsernameFree = await db.userAuth.isUsernameAvailable(username);

  if (!isEmailFree) {
    ctx.body = 'email is already taken';
    ctx.response.status = 412;
    return;
  } else if (!isUsernameFree) {
    ctx.body = 'username is already taken';
    ctx.response.status = 412;
    return;
  }

  const user = await db.userAuth.newUser(email, username, password);
  if (!user) {
    ctx.body = 'unable to create user';
    ctx.response.status = 500;
    return;
  }

  const token = db.userAuth.createToken(user);

  ctx.set('Access-Token', token);
  ctx.body = 'authentication successful!';
};

/***********************************
 *  Routing
 ***********************************/
export const path = '';
export const routing = [
  ['GET', '/', authenticateUser],
  ['POST', '/', newUser],
];

export default { path, routing };
