import config from 'config';
import {errorHandler, apiValidation} from './midddleware';
import { Application } from 'express';
import version1 from './Version1';
import { AppError } from './utils/lib';
import { NOT_FOUND } from './utils/constant';

const prefix: (string | RegExp)[] = config.get('api.prefix');

/**
 * The routes will add all the application defined routes
 * @param {app} app The main is an instance of an express application
 * @return {Promise<void>}
 */
export default async (app: Application) => {

  // check if api key is present
  app.use(prefix, apiValidation);

  // load version 1 routes
  app.use('/v1', version1);

  // check url for state codes and api version
  app.use((req, res, next) => {
    const err: Record<string, any> = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // check if url contains empty request
  app.use('*', (req, res, next) => {
    return next(new AppError('not found', NOT_FOUND));
  });

  // load the error middleware
  app.use(errorHandler);

  return Promise.resolve(app);
}
