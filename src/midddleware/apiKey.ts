import { AppError } from '../utils/lib';
import { Request, Response, NextFunction } from 'express';
import { UNAUTHORIZED } from '../utils/constant';

export default (req: Request, res: Response, next: NextFunction) => {
  // check header or url parameters or post parameters for token
  let apiKey = req.query?.api_key || req.headers['x-api-key'];
  // check if no api key
  if (!apiKey) {
    return next(new AppError('Api key absent', UNAUTHORIZED));
  }

  // check if api key is correct
  if (apiKey !== process.env?.API_KEY){
    return next(new AppError('Invalid Api Key', UNAUTHORIZED));
  }

  // if there is no token, return an error
  return next();
};
