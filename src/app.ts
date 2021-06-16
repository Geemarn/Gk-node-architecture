import 'core-js/stable';
import 'regenerator-runtime/runtime';
import express, { Application, Response, Request } from 'express';
import cors from 'cors';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import config from 'config';
import initializeMongoDb from './database.config';
import log from './utils/logger';
import http from 'http';
import { dbLogMessage } from './utils/helpers';

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
export const database = initializeMongoDb()
  .then(() => {
    return app.get('/', (req: Request, res: Response) => {
      res.send({ hello: 'world' });
    });
  })
  .then(
    async (app: Application) => {
      const server: Record<string, any> = await http
        .createServer(app)
        .listen(config.get('app.port'));
      log.debug(dbLogMessage(server));
      return Promise.resolve(app);
    },
    (err) => {
      console.log('There was an un catch error : ');
      console.log('==============================');
      console.error(err);
    }
  );
