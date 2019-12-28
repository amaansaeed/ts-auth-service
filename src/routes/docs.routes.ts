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
const logger = debug('authentication-service:docs');

/***********************************
 *  Controllers
 ***********************************/
const getDocs = async (ctx: koa.Context, next: Function) => {
  ctx.body = { data: 'authentication docs' };
};

/***********************************
 *  Routing
 ***********************************/
export const path = '/docs';
export const routing = [['GET', '/', getDocs]];

export default { path, routing };
