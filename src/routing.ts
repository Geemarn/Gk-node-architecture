import config from 'config';
import { errorHandler } from './midddleware';
import { Application, NextFunction, Response, Request } from 'express';
import {apiKeyValidation} from './midddleware';
import v1 from './version1';
import { AppError } from './utils/lib';
import { NOT_FOUND } from './utils/constant';
import { T } from './version1/rest/types';


const prefix: (string | RegExp)[] = config.get('api.prefix');

/**
 * The routes will add all the application defined routes
 * @param {app} app The main is an instance of an express application
 * @return {Promise<void>}
 */
export default async (app: Application) => {
  // check if api key is present
  app.use(prefix, apiKeyValidation);

  // load version 1 routes
  app.use('/v1', v1);

  // check url for state codes and api version
  app.use((req: Request, res: Response, next: NextFunction) => {
    const err: T = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // check if url contains empty request
  app.use('*', (req: Request, res: Response, next: NextFunction) => {
    return next(new AppError('not found', NOT_FOUND));
  });

  // load the error middleware
  app.use(errorHandler);

  return Promise.resolve(app);
};
