import config from 'config';
import { AppError } from '../utils/lib';
import { T } from '../version1/rest/types';
import { Request, Response, NextFunction } from 'express';


export default (error: T, req: Request, res: Response, next: NextFunction) => {
  const meta: T = {};
  if (error instanceof AppError) {
    const err = error.format();
    const code = err.code;
    meta.status_code = code;
    meta.error = { code, message: err.message };
    if (err.messages) {
      meta.error.messages = err.messages;
    }
    if (err.type) {
      meta.error.type = err.type;
    }
  } else if (error instanceof Error) {
    const err: T = error;
    meta.status_code = err.status;
    meta.error = { code: err.status, message: err.message };
    meta.developer_message = err;
  } else if (error.statusCode === 400 && !error.message.includes('limit')) {
    const code = error.statusCode;
    meta.status_code = code;
    meta.error = { code, message: error.message };
  } else {
    let code = 500;
    meta.status_code = code;
    meta.error = {
      code: code,
      message: 'A problem with our server, please try again later',
    };
    meta.developer_message = error;
  }
  if (`${config.util.getEnv('NODE_ENV')}` !== 'production') {
    console.log('error >>>>>>>>>>>>>>> ', error);
  }
  return res.status(meta.status_code || 500).json({ meta });
};
