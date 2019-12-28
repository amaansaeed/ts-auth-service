/***********************************
 *  Dependencies
 ***********************************/
// import Router from 'koa-router';
import koa from 'koa';
import debug from 'debug';

/***********************************
 *  Variables & Initializations
 ***********************************/
const logger = debug('authentication-service:health');

/***********************************
 *  Controllers
 ***********************************/
const checkHealth = async (ctx: koa.Context, next: Function) => {
  ctx.body = { message: 'server healthy!' };
};

/***********************************
 *  Routing
 ***********************************/
export const path = '/health';
export const routing = [['GET', '/', checkHealth]];

export default { path, routing };
