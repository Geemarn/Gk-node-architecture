import 'core-js/stable';
import 'regenerator-runtime/runtime';
import express, { Application } from 'express';
import cors from 'cors';
import http from 'http';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import config from 'config';
import initializeMongoDb from './database.config';
import log from './utils/logger';
import { dbLogError, dbLogMessage } from './utils/helpers';
import routes from './routing';

/** initialize app using express **/
const app: Application = express();

/** setup app using other libraries **/
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

/** set app port **/
app.set('port', config.get<string>('app.port'));

/** initialize mongo db using mongoose **/
const database = initializeMongoDb();

const loadedRoutes = database.then(() => {
  log.debug(
    `\n \t***Database loaded*** \n \tUrl => ${config.get<string>(
      'databases.mongodb.test'
    )}`
  );
  return routes(app);
});

export const server = loadedRoutes
  .then(async (app: Application) => {
    const httpServer = await http.createServer(app).listen(config.get('app.port'));
    log.debug(dbLogMessage(httpServer));
    return Promise.resolve(app);
  })
  .catch((e) => log.debug(dbLogError(e)));

//export app to be used during test
export const testServer = app.listen(5100, () => console.log('testing!!!!!!'));
