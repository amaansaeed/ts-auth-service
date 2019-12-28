import fs from 'fs';
import compose from 'koa-compose';
import Router from 'koa-router';

const ROOT_PATH = process.env.ROOT_PATH || '/auth';

export const applyRouting = (router: Router, routes: any[]) => {
  routes.map(routeArr => {
    const [method, route, actions] = routeArr;
    const actionsPrepped = Array.isArray(actions) ? actions : [actions];

    switch (method) {
      case 'GET':
        router.get(route, ...actionsPrepped);
        break;
      case 'PUT':
        router.put(route, ...actionsPrepped);
        break;
      case 'POST':
      case 'POS':
        router.post(route, ...actionsPrepped);
        break;
      case 'DEL':
      case 'DELETE':
        router.del(route, ...actionsPrepped);
        break;
      case 'ALL':
        router.all(route, ...actionsPrepped);
      default:
        break;
    }
  });
  return;
};

const router = () => {
  let routers: any[] = [];
  //  We pull in every file in this directory
  fs.readdirSync(__dirname)
    .filter(
      file =>
        file.indexOf('.') !== 0 &&
        file !== __filename && //  to ignore this file
        file.slice(-10) === '.routes.ts' //  to check the files end with .routes.js
    )
    .forEach(file => {
      const filePath = `${__dirname}/${file}`;
      const { path, routing } = require(filePath).default;
      const router = new Router({
        prefix: path && path.length > 0 ? ROOT_PATH + path : ROOT_PATH,
      });
      applyRouting(router, routing);
      routers.push(router.routes(), router.allowedMethods());
    });
  return compose(routers);
};

export default router;
