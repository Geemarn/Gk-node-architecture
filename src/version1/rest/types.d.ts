import { Request, Response, NextFunction } from 'express';

export type modelType = Schema<any, Model<any, any, any>, undefined>;
export type T = Record<string, any>;
export type apiResponseType = {
  model: T;
  value: T;
  code: number;
  message: string | T;
  queryParser: T;
  pagination: T;
  count: number;
  token: string;
  email: T;
  mobile: T | Array<T>;
};

export interface AppRequestType extends Request {
  object: Record<string, any>;
  response: Record<string, any>;
  userId: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    object: T;
    response: T;
    userId: string;
  }

  interface Response {}

  interface NextFunction {}
}
