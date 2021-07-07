import 'core-js/stable';
import 'regenerator-runtime/runtime';
import express, { Application, Response, Request } from 'express';
import cors from 'cors';
import http from 'http';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import config from 'config';
import initializeMongoDb from './database.config';
import log from './utils/logger';
import { dbLogError, dbLogMessage } from './utils/helpers';
import loadRoutes from './routing';

/** initialize app using express **/
const app: Application = express();

/** setup app using other libraries **/
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

/** set app port **/
app.set('port', config.get('app.port'));

/** initialize mongo db using mongoose **/
export default initializeMongoDb()
  .then(() => {
    log.debug(
      `\n \t***Database loaded*** \n \tUrl => ${config.get(
        'databases.mongodb.test'
      )}`
    );
    return loadRoutes(app);
  })
  .then(
    async (app: Application) => {
      const server = await http
        .createServer(app)
        .listen(config.get('app.port'));
      log.debug(dbLogMessage(server));
      return Promise.resolve(app);
    },
    (err) => log.debug(dbLogError(err))
  );
