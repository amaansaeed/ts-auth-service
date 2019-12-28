/***********************************
 *  Dependencies
 ***********************************/
import Koa from 'koa';
import koaLogger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import routes from './routes';
import debug from 'debug';
import http from 'http';
import * as dotenv from 'dotenv';
import path from 'path';

/***********************************
 *  Variables
 ***********************************/
//  Environment Variables
const __TEST__ = process.env.ENV === 'test';
const __DEV__ =
  (process.env.ENV === 'development' || process.env.ENV === 'docker') &&
  'development';
dotenv.config({
  path: path.resolve(process.cwd(), `.env.${process.env.ENV || 'development'}`),
});
const PORT = process.env.PORT || 5000;

const logger = debug('authentication-service:server');
logger(`environment: ${process.env.ENV}`);

/***********************************
 *  Koa
 ***********************************/
//  Koa Setup
const app: Koa = new Koa();

//  Middleware
if (__DEV__) app.use(koaLogger()); //  Logger - only for dev
app.use(bodyParser());
app.use(routes());

//  Port listener
const server = __TEST__
  ? http.createServer(app.callback())
  : app.listen(PORT).on('error', err => {
      logger(err);
    });
logger(`listening on port ${PORT}`);

export default server;
