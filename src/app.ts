import 'core-js/stable';
import 'regenerator-runtime/runtime';
import express, {Application, Response, Request, NextFunction} from 'express';
import cors from 'cors';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import config from 'config';


/** initialize app using express **/
const app: Application = express();

/** setup app using other libraries **/
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(cors());

const add = (a: number, b:number): number => a + b;

app.get('/', (req:Request, res:Response) => {
  res.send({hello: 'world'})
});
add(5, 4);

app.listen(4000, () => console.log('running'));
