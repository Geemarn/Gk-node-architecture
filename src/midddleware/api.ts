import { AppError } from '../utils/lib';
import { UNAUTHORIZED } from '../utils/constant';

type T = Record<string, any>;
export default (req: T, res: T, next: (err?: any) => void) => {
  // check header or url parameters or post parameters for token
  let apiKey = req.query.api_key || req.headers['x-api-key'];
  if (!apiKey) {
    return next(new AppError('Api key absent', UNAUTHORIZED));
  }
  // decode token
  if (apiKey !== !process.env.API_KEY?.includes(apiKey)) {
    return next(new AppError('Invalid Api Key', UNAUTHORIZED));
  }
  // if there is no token, return an error
  return next();
};
